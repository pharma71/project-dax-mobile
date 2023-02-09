import { CsvJSONPipe } from './csv-json.pipe';

describe('CsvJSONPipe', () => {
  it('create an instance', () => {
    const pipe = new CsvJSONPipe();
    expect(pipe).toBeTruthy();
  });
});
