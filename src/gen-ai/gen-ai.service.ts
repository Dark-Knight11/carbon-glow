import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { transactions } from '../drizzle/schema';

@Injectable()
export class GenAiService {
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;

  constructor(private readonly dbService: DatabaseService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: `
        Calculate the carbon footprint in kilograms (kg) for each transaction based on the following details. Use the provided variables to calculate the footprint per item, categorize them by 'category', and sum the results for each category.
        Input Details:
        - 'amount': {{amount}} (the monetary value of the transaction)
        - 'category': {{category}} (e.g., Food, Technology, Transport, or Clothing)
        - 'item_name': {{item_name}} (e.g., 'lays' for food, 'petrol' for fuel, etc.)
        - 'quantity': {{quantity}} (e.g., packets for food items, liters for fuel, units for tech items, etc.)

        Instructions:
        1. Carbon Emission Factor Selection: Identify the carbon emission factor per unit based on 'category', 'item_name', and 'quantity':
        - For Food items (e.g., packets of chips), use CO₂ per packet or item.
        - For Transport, use per-person or per-liter emission rates for the mode type.
        - For Technology, calculate based on the device or equipment type.
        - For Clothing, use CO₂ per-item or per-unit.

        2. Calculate Per-Transaction Carbon Footprint:
        - Calculate the carbon footprint as:
            Carbon Footprint (kg) = Quantity × Emission Factor (kg CO₂)
        - Don't output any explanation or assumptions in response.

        Expected JSON Output Format:

        The output should be organized as follows:

        {
            "carbon_footprint_summary": {
                "Food": {
                    "total_kg_co2": "{{total_food_kg_co2}}",
                    "transactions": [
                        {
                            "item_name": "{{item_name}}",
                            "quantity": "{{quantity}}",
                            "amount": "{{amount}}",
                            "kg_co2": "{{transaction_kg_co2}}"
                        }
                    ]
                },
            "Technology": {
                "total_kg_co2": "{{total_technology_kg_co2}}",
                "transactions": [
                    {
                        "item_name": "{{item_name}}",
                        "quantity": "{{quantity}}",
                        "amount": "{{amount}}",
                        "kg_co2": "{{transaction_kg_co2}}"
                    }
                ]
            },
            "Transport": {
                "total_kg_co2": "{{total_transport_kg_co2}}",
                "transactions": [
                    {
                        "item_name": "{{item_name}}",
                        "quantity": "{{quantity}}",
                        "amount": "{{amount}}",
                        "kg_co2": "{{transaction_kg_co2}}"
                    }
                ]
            },
            "Clothing": {
                "total_kg_co2": "{{total_clothing_kg_co2}}",
                "transactions": [
                    {
                        "item_name": "{{item_name}}",
                        "quantity": "{{quantity}}",
                        "amount": "{{amount}}",
                        "kg_co2": "{{transaction_kg_co2}}"
                    }
                ]
            }
        },
        "overall_total_kg_co2": "{{overall_total_kg_co2}}"
    }
  `,
    });
  }

  async getCarbonFootprint(userId: string) {
    const transactionsData =
      await this.dbService.db.query.transactions.findFirst({
        where: and(
          eq(transactions.user_id, userId),
          isNotNull(transactions.category),
        ),
      });

    const prompt = `
      Calculate the carbon footprint for following transaction:
        amount: ${transactionsData.amount}
        category: ${transactionsData.category}
        item_name: ${transactionsData.item}
        quantity: ${transactionsData.quantity}
    `;
    console.log('Prompt', prompt);
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Response:', text);

    return JSON.parse(
      text
        .trim()
        .replace(/```json/g, '')
        .replace(/{ "/g, '')
        .replace(/```/g, ''),
    );
  }
}
