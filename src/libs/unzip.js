'use strict';

// unzip lib
import { unzipSync, strFromU8 } from 'fflate';


export async function unzip(blob){

    // data as buffer
    const buff = await blob.arrayBuffer();

    // as uint
    const uint_buff = new Uint8Array(buff);

    // unzip
    const unzipped = unzipSync(uint_buff);

    // grab
    const content = Object.values(unzipped).map(uint8arr => {
        return JSON.parse(strFromU8(uint8arr));
    })

    return content;
}
