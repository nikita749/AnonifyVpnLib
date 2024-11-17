
import { v5 as uuidv5 } from "uuid";

import { XuiApi } from "3x-ui";
import crypto from "crypto";
import nacl from "tweetnacl";

import Vpn from './AnonifyVpnLib/vpn.js';


async function main(params) {
    
    const username = "275xX2iisU";
    const password = "9FJQ066jA0";
    const webPath = "/WJkll8xmJcahuUo/";
    const subName = "OCW-VLESS-NL";


    const api = new XuiApi(`https://${username}:${password}@ocwvpn.ru:35790/${webPath}`);
    api.debug = true; // Enables debug mode - defualt is false
    api.stdTTL = 60; // Cache time in seconds - default is 10s

    let vpn = new Vpn(api);
    
    // await vpn.addVlessInbound(api); // Add new Inbound
    
    api.getInbounds(); // Get all inbounds

    // vpn.addNewClient(api, 1, "90192019", "guba", 10, subName); // Add new client
    
    vpn.clientUpdateSubDuration(api, "90192019", 90); // Update subscription duration for client
    
}

main().catch((err) => console.error(err));