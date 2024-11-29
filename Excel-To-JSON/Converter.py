import pandas as pd
import json
import os

def excel_to_json(excel_path, output_json):
    try:
        # Check if the Excel file exists at the given path
        if not os.path.exists(excel_path):
            raise FileNotFoundError(f"The file {excel_path} does not exist.")
        
        # Read the Excel file
        df = pd.read_excel(excel_path, sheet_name=0, dtype=str, engine='openpyxl')

        # Define the columns to extract (updated column names)
        columns_to_extract = [
            "In welcher Klasse sind sie zur Zeit?",  # Corrected column name
            "Wie oft benutzen sie ChatGPT / andere KI Tools?",  # Corrected column name
            "Wie wahrscheinlich ist es, dass sie eine KI im Unterricht verwenden?",  # Corrected column name
            "Welches dieser KI - Tools nutzen sie am häufigsten?"  # Corrected column name
        ]

        # Check if the necessary columns exist in the Excel file
        missing_columns = [col for col in columns_to_extract if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing columns in Excel file: {', '.join(missing_columns)}")

        # Extract the required columns and handle missing values
        df_filtered = df[columns_to_extract].fillna("No Answer")

        # Convert DataFrame to a list of dictionaries
        data = df_filtered.to_dict(orient='records')

        # Define the path to the `src` folder where JSON file will be saved
        current_directory = os.getcwd()
        output_json_path = os.path.join(current_directory, 'src', output_json)

        # Ensure the src folder exists
        if not os.path.exists(os.path.join(current_directory, 'src')):
            os.makedirs(os.path.join(current_directory, 'src'))

        # Write the data to a JSON file
        with open(output_json_path, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent=4)

        print(f"Successfully converted {excel_path} to {output_json_path}")
    except Exception as e:
        print(f"Error during conversion: {e}")

if __name__ == "__main__":
    # Absolute path to the Excel file in the main function
    excel_path = "C:\\_repos\\ITP-KI_Umfrage\\Excel-To-JSON\\responses.xlsx"
    
    # The output JSON file name in the `src` folder
    output_json = 'data.json'

    # Run the conversion function with the absolute path
    excel_to_json(excel_path, output_json)
