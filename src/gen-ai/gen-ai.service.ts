import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { transactions } from '../drizzle/schema';

@Injectable()
export class GenAiService {
  genAI: GoogleGenerativeAI;

  constructor(private readonly dbService: DatabaseService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  }

  async getCarbonFootprintOfTransactions(userId: string) {
    const model = this.genAI.getGenerativeModel({
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(
      text
        .trim()
        .replace(/```json/g, '')
        .replace(/{ "/g, '')
        .replace(/```/g, ''),
    );
  }

  async getCarbonFootprintOfTransportation(
    from: string,
    to: string,
    distance: number,
  ) {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: `
         Instructions:
          1. Distance Calculation:
            - Use the input distance between Point A and Point B (in kilometers) as provided.
            
          2. Emission Factors:
            - Diesel Car (SUV): Use a standard emission factor (e.g., X kg CO₂ per km).
            - Petrol Car (SUV): Use a standard emission factor (e.g., Y kg CO₂ per km).
            - Electric Vehicle (SUV): Use a standard emission factor (e.g., Z kg CO₂ per km).
            - Electric Train (EMU): Use a standard emission factor (e.g., W kg CO₂ per km).

          3. Carbon Footprint Calculation:
            - For each transport mode, calculate the carbon footprint as:
              Carbon Footprint (kg) = Distance × Emission Factor (kg CO₂ per km)

          4. Output Format:
            - Provide the results in JSON format, with each transport mode’s carbon footprint in kg.

          Expected Output JSON Format:
          {
            "carbon_footprint_transport": {
              "diesel_car_kg_co2": "{{diesel_car_kg_co2}}",
              "petrol_car_kg_co2": "{{petrol_car_kg_co2}}",
              "ev_car_kg_co2": "{{ev_car_kg_co2}}",
              "electric_train_kg_co2": "{{electric_train_kg_co2}}"
            }
          }
          Don't send any explanation and assumptions in response
  `,
    });

    const prompt = `
      Calculate the carbon footprint in kilograms (kg) for the distance traveled between ${from} and ${to}.

      Input Details:
      - distance_km: ${distance} (the distance between ${from} and ${to} in kilometers)
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(
      text
        .trim()
        .replace(/```json/g, '')
        .replace(/{ "/g, '')
        .replace(/```/g, ''),
    );
  }
}
