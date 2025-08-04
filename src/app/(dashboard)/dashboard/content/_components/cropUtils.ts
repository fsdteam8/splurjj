export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<File> {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 300; // Fixed width
  canvas.height = 300; // Fixed height

  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    300,
    300
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], "cropped-image.jpg", { type: "image/jpeg" }));
      }
    }, "image/jpeg");
  });
}