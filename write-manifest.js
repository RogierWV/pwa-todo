const fs = require('fs');
fs.readdir("public/img", (e, files) => 
    console.log(JSON.stringify(files.sort((a,b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0])).map(f => {
        const size = f.split('.')[0]
        return {
            src: `/img/${f}`,
            sizes: `${size}x${size}`,
            type: "image/png"
        }
    }
    ), null, 4)));