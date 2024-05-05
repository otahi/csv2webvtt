import { parse } from 'csv-parse';
import * as fs from 'fs';

type Cue = { speaker:string|null, start:string|null, end:string|null, text:string|null };

export class Csv2Webvtt {
  private inputCsv:string;
  private output:string;

  private parser;

  private readStream:fs.ReadStream;
  private writeStream:fs.WriteStream;

  constructor(inputCsv:string, output:string) {
    this.inputCsv = inputCsv;
    this.readStream = fs.createReadStream(inputCsv, 'utf-8');
    this.output = output;
    this.writeStream = fs.createWriteStream(output);

    this.parser = parse({
      delimiter: ',',
    });
  }

  public async convert() {
    this.writeStream.write('Webvtt\n');
    let isFirstLine = true;
    let cue:Cue = { speaker: null, start: null, end: null, text: null };
    this.readStream.pipe(this.parser.on('data', (data) => {
        // Skip 1st line
        if (isFirstLine) {
          isFirstLine = false;
          return;
        }

        // csv
        // time_from_start,date,time,speaker,bookmark flag, text

        const nextCue:Cue = { speaker: null, start: null, end: null, text: null };

        // webvtt
        // 00:00:01.000 --> 00:00:05.330
        // <v Joe>My name is Joe</v>

        nextCue.start = data[0];   // time_from_start
        nextCue.speaker = data[3]; // speaker
        nextCue.text = data[5];    // text

        if (nextCue.start) {
          cue.end = nextCue.start;
        }

        if (nextCue.text) {
          nextCue.text = nextCue.text.replace(/-->/g, '==>');
        }

        if (cue.text) {
          this.writeStream.write(`${cue.start} --> ${cue.end}\n<v ${cue.speaker}>${cue.text}</v>\n`);
        }

        cue = nextCue;
      }),
    );
  }
}

