// Resize and crop each uploaded image, then display it in a grid with the file name and a clickable link to view the original image.

uploadedFiles.forEach(file => {

                //Filestack transformation
                const resizedUrl = `https://cdn.filestackcontent.com/resize=width:200,height:200,fit:crop/${file.handle}`;
                uploadStatus += `
                <div>
                    <img src="${resizedUrl}" alt="${file.filename}" />
                    <p>${file.filename}</p>
                    <a href="${file.url}" target="_blank">View Image</a>
                </div>
                `;
            });
