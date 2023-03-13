import Jimp from 'jimp';

// Load font file that's compatible with Jimp
// See https://github.com/jimp-dev/jimp/tree/main/packages/plugin-print
const font = await Jimp.loadFont('assets/rubik-white-64.fnt');

/**
 * Generate an image from a base image and text to add on top of that image
 * @param image Image to draw put text on
 * @param text  Text to add to image
 * @param out   File location for generated image
 */
export async function GenerateImage(image, text, out) {
  const baseImage = await Jimp.read(image);

  baseImage
    .print(
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
