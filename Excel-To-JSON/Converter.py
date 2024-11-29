import pandas as pd
import json
import os

def excel_to_json(excel_file, output_json):
    # Read the Excel file
    df = pd.read_excel(excel_file)

    # Convert to JSON
    data = df.to_dict(orient='records')

    # Save to JSON
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    excel_file = 'responses.xlsx'  # Input Excel file
    output_json = 'data.json'      # Output JSON file
    if os.path.exists(excel_file):
        excel_to_json(excel_file, output_json)
        print(f"Converted {excel_file} to {output_json}")
    else:
        print(f"{excel_file} not found.")