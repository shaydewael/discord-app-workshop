import Jimp from 'jimp';
import fs from 'fs';


const font = await Jimp.loadFont('assets/rubik-white-64.fnt');

export async function GenerateImage(image, text, out) {
  // TODO: error handling
  const baseImage = await Jimp.read(image);
  baseImage.print(
      font,
      240,
      20,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      630,
      390
    )
  return baseImage.writeAsync(out);
}
