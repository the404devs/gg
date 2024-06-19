import csv
from pykml import parser
from lxml import etree
from datetime import datetime

def kml_to_csv(kml_file, csv_file):
    # Parse the KML file
    with open(kml_file, 'r') as f:
        root = parser.parse(f).getroot()

    # Find all Placemark elements with coordinates
    placemarks = root.Document.Placemark

    # Create CSV file
    with open(csv_file, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['timestamp', 'latitude', 'longitude'])

        # Iterate over placemarks
        for placemark in placemarks:
            timestamp = placemark.TimeSpan.begin
            coordinates = placemark.Point.coordinates.text.strip()

            # Extract latitude and longitude
            lon, lat, _ = map(float, coordinates.split(','))

            # Convert timestamp to desired format
            # timestamp = datetime.strptime(str(timestamp), '%Y-%m-%dT%H:%M:%SZ')
            # timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S')

            # Write to CSV
            csvwriter.writerow([timestamp, lat, lon])

# Example usage
kml_to_csv('history-2022-05-15.kml', 'output.csv')

