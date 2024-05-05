# CSV to WebVTT Converter

This tool converts CSV files into WebVTT format, allowing you to automate the creation of VTT files from structured CSV data. It's built with Node.js and is easy to use via command line.

## Features

- Convert CSV files to WebVTT format.
- Command-line interface for easy operation.
- Customizable mapping of CSV columns to VTT properties.

## Installation

Before you can use the CSV to WebVTT Converter, make sure you have Node.js installed on your machine. [Download Node.js](https://nodejs.org/)

Once Node.js is installed, follow these steps to install the CSV to WebVTT Converter:

1. Clone the repository:
   ```bash
   git clone https://github.com/otahi/csv2webvtt.git
   cd csv2webvtt
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Build the project (if required):
   ```bash
   npm run build
   ```

## Usage

To convert a CSV file to WebVTT format, use the following command:

```bash
npm run start -- --input ./input.csv --output ./out.vtt
```

### Command Line Options

- `--input`: Specifies the path to the input CSV file.
- `--output`: Specifies the path where the output WebVTT file should be saved.

## Example

Given a CSV file `input.csv` with the following content:

```csv
time_from_start,date,time,speaker,bookmark flag, text
00:00:00.000,2024/05/05,23:22:55,Hiroshi,,Welcome to our presentation.
00:00:10.000,2024/05/05,23:22:55,Hiroshi,,Thank you for joining us today.
```

Run the converter:

```bash
npm run start -- --input ./input.csv --output ./out.vtt
```

The output `out.vtt` will look like:

```vtt
WEBVTT

1
00:00:00.000 --> 00:00:10.000
<v Hiroshi>Welcome to our presentation.</v>

2
00:00:10.000 --> 00:00:20.000
<v Hiroshi>Thank you for joining us today.</v>
```

## Contributing

Contributions to improve the CSV to WebVTT Converter are welcome. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
```