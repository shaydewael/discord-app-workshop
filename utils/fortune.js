import fs from 'fs';
import path from 'node:path';

const IMAGE_PATH = './assets/templates';

/**
 * Go through folder and get all image paths
 * @param folder Relative path for the folder where the images are
 */
function getImages(folder) {
  const resolvedPath = path.resolve(folder);
  const images = [];

  // Go through folder and collect all of the images
  fs.readdirSync(resolvedPath).forEach((file) => {
    // Get extension of the file
    const fileExt = path.extname(file);
    // In case any non-images sneak in the folder, filter those out
    if (fileExt === '.png' || fileExt === '.jpg') {
      images.push(file);
    }
  });

  return images;
}

/**
 * Get random value from array
 * @param arr
 */
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random fortune 
 */
export function GetRandomFortune() {
  const fortuneTexts = [
    'YESSSSSSSSSSSS',
    '100%',
    'literally yea',
    'no doubt',
    'oh for sure for sure',
    'you got this',
    "it's a slay",
    'the answer you seek is found within',
    'the answer is clear as mud',
    'hmmmm...maybe try a tarot reading instead?',
    "we've been over this",
    '...literally no',
    'lol no',
    'ngl not looking great...',
    'like keep asking but the answer is still no',
    'really? ask me later...',
    'you ate on that one...',
  ];

  return getRandom(fortuneTexts);
}

// fetch all images from folder
const fortuneBackgrounds = getImages(IMAGE_PATH);

/**
 * Get random base image from defined folder
 */
export function GetRandomImage() {
  return IMAGE_PATH + '/' + getRandom(fortuneBackgrounds);
}
