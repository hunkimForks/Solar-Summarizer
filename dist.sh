#!/bin/bash

# Read the JSON file
json_file="manifest.json"

# Extract the name and version from the JSON file using grep, sed, and awk
name=$(grep '"name"' $json_file | head -n 1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
version=$(grep '"version"' $json_file | head -n 1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)

# Check if the name is empty
if [ -z "$name" ]; then
    echo "Error: 'name' is not found in the JSON file."
    exit 1
fi

# Check if the version is empty
if [ -z "$version" ]; then
    echo "Error: 'version' is not found in the JSON file."
    exit 1
fi

# Replace spaces with underscores and convert to lowercase for filename
filename="${name// /_}.${version}.zip"
filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')

# Print the generated file name
echo "Generated file name: $filename"

# Create the zip file
zip -r "../$filename" ./ -x '*.git*'

# Print a message indicating the zip file was created
echo "Created zip file: ../$filename"
