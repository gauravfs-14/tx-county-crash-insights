import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # Open the CSV file and convert its content to a list of dictionaries
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        data = list(reader)

    # Write the list of dictionaries to a JSON file with indentation for readability
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)
    
    print(f"Converted '{csv_file_path}' to '{json_file_path}' successfully.")

if __name__ == '__main__':
    csv_file = "./src/data/TX_County_Year_CrashSeve.csv"
    json_file = "./src/data/crash-data.json"
    csv_to_json(csv_file, json_file)
