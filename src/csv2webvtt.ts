import { parse } from 'csv-parse';
import moment from 'moment';
import * as fs from 'fs';

type Cue = { speaker:string|null, start:moment.Moment|null, end:moment.Moment|null, text:string|null };
const timeFormat = "HH:mm:ss.SSS";

export class Csv2Webvtt {
  private inputCsv:string;
  private output:string;

  private parser;

  private timeshift = {sign: '', hours: 0, minutes: 0,seconds: 0, isSet: false};

  private readStream:fs.ReadStream;
  private writeStream:fs.WriteStream;

  constructor(inputCsv:string, output:string, timeshift:string|undefined) {
    this.inputCsv = inputCsv;
    this.readStream = fs.createReadStream(inputCsv, 'utf-8');
    this.output = output;
    this.writeStream = fs.createWriteStream(output);

    this.parser = parse({
      delimiter: ',',
    });

    if (typeof timeshift === 'string' && timeshift.length > 0) {
      const timeshiftPattern = /^(?:(?<sign>[+-])?(?:(?<hours>\d{1,2}):)?(?<minutes>\d{1,2})(?::(?<seconds>\d{1,2}(?:\.\d+)?))?|(?<sign2>[+-])?(?<singleSeconds>\d+(\.\d+)?))$/;
      const {sign, hours, minutes, seconds, sign2, singleSeconds}
        = timeshift.match(timeshiftPattern)?.groups as {sign:any, hours:any, minutes:any, seconds:any, sign2:any, singleSeconds:any};

        this.timeshift = {
        sign: sign || sign2,
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
        seconds: parseFloat(seconds || singleSeconds || '0'),
        isSet: true,
      }
    }
  }

  public async convert() {
    this.writeStream.write('WEBVTT\n\n');
    let isFirstLine = true;

    let cue:Cue = { speaker: null, start: null, end: null, text: null };
    let nextCue:Cue = { speaker: null, start: null, end: null, text: null };

    this.readStream.pipe(this.parser.on('data', (data) => {
        // Skip 1st line
        if (isFirstLine) {
          isFirstLine = false;
          return;
        }

        // csv
        // time_from_start,date,time,speaker,bookmark flag, text
        nextCue = { speaker: null, start: null, end: null, text: null };

        // WEBVTT
        //
        // 00:00:01.000 --> 00:00:05.330
        // <v Joe>My name is Joe

        nextCue.start = moment(data[0], timeFormat);   // time_from_start
        nextCue.speaker = data[3]; // speaker
        nextCue.text = data[5];    // text

        if (nextCue.start) {
          let time = moment(nextCue.start, timeFormat);
          if (this.timeshift.isSet) {
            const timeshift = this.timeshift;
            if (timeshift.sign === '-') {
              time.subtract({ hours: timeshift.hours, minutes: timeshift.minutes, seconds: timeshift.seconds });
            } else {
              time.add({ hours: timeshift.hours, minutes: timeshift.minutes, seconds: timeshift.seconds });
            }
          }

          nextCue.start = time;
          cue.end = nextCue.start;

          if (cue.start?.isSame(nextCue.start) || cue.start?.isAfter(cue.end)) {
            nextCue.text = `${cue.text}${nextCue.text}`;
            cue.text = null;
          }
        }

        if (nextCue.text) {
          nextCue.text = nextCue.text.replace(/-->/g, '==>');
        }

        if (cue.text) {
          this.writeStream.write(`${cue.start?.format(timeFormat)} --> ${cue.end?.format(timeFormat)}\n<v ${cue.speaker}>${cue.text}\n\n`);
        }

        cue = nextCue;
      }).on('finish', () => {
        this.writeStream.write(`${nextCue.start?.format(timeFormat)} --> ${nextCue.start?.add({seconds: 0.01}).format(timeFormat)}\n<v ${nextCue.speaker}>${nextCue.text}\n\n`);
      }),
    );
  }
}

