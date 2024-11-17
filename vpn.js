import { v5 as uuidv5 } from "uuid";

import { XuiApi } from "3x-ui";
import crypto from "crypto";
import nacl from "tweetnacl";
import { timeStamp } from "console";

class Vpn{
    
    constructor(domen, port, webPath, username, password){
        this.domen = domen;
        this.port = port;
        this.webPath = webPath;
        this.username = username;
        this.password = password;
    }

        // Функция для генерации случайного целого числа
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    // Функция для кодирования в base64url
    base64UrlEncode(buffer) {
        return Buffer.from(buffer)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
    
    // Функция для генерации публичного и приватного ключей
    genPubPrivRealityKeys() {
        const keyPair = nacl.box.keyPair();
    
        const privateKeyBase64 = this.base64UrlEncode(keyPair.secretKey);
        const publicKeyBase64 = this.base64UrlEncode(keyPair.publicKey);
    
        return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
    }
    
    // Функция для генерации shortIds
    genShortIdsForReality(idsCount) {
        const characters = "1234567890abcdef";
        const shortIds = [];
    
        for (let i = 0; i < idsCount; i++) {
        const length = this.randomInt(1, 9) * 2; // Генерируем четное число от 2 до 16
        let id = "";
        for (let j = 0; j < length; j++) {
            id += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        shortIds.push(id);
        }
    
        return shortIds;
    }

    getSubscriptionUrl(subName) {
        return `http://ocwvpn.ru:443/ASDFGHJkl/ocw/connect/sub/${subName}`;
    }
    
    

    generateRandomString(length) {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }


    async addVlessInbound(api) {
        // Define the subscription name for the new inbound
        const subscriptionName = "OCW-VLESS-NL"; 
    
        // Generate a random Telegram chat ID and create a UUID for the client
        const vlessTgChatId = this.generateRandomString(8);
        const namespace = uuidv5.URL;
        const uuid = uuidv5(vlessTgChatId, namespace);
    
        // Create a new VLESS client configuration
        const newVlessClient = {
            id: uuid,
            email: vlessTgChatId,
            flow: "",
            enable: true,
            subId: subscriptionName,
            expiryTime: 0,
            limitIp: 0,
            reset: 0,
            totalGB: 0,
            tgId: "",
        };
    
        // Define the VLESS settings
        const vlessSettings = {
            clients: [newVlessClient],
            decryption: "none",
            fallbacks: [],
        };
    
        // Generate Reality settings
        const realitySettings = {
            show: false,
            xver: 0,
            dest: "telegram.org:443",
            serverNames: ["telegram.org"],
            privateKey: this.genPubPrivRealityKeys().privateKey,
            shortIds: this.genShortIdsForReality(8),
            settings: {
                publicKey: this.genPubPrivRealityKeys().publicKey,
                fingerprint: "random",
                serverName: "",
                spiderX: "/",
            },
        };
    
        // Define TCP settings
        const vlessTcpSettings = {
            acceptProxyProtocol: false,
            header: { type: "none" },
        };
    
        // Define stream settings
        const streamSettings = {
            network: "tcp",
            security: "reality",
            externalProxy: [],
            realitySettings: realitySettings,
            tcpSettings: vlessTcpSettings,
        };
    
        // Create the inbound configuration
        const inboundConfig = {
            enable: true,
            port: 443, // Use the specified port
            protocol: "vless",
            settings: vlessSettings,
            streamSettings: streamSettings,
            sniffing: {
                enabled: false,
                destOverride: ["http", "tls", "quic", "fakedns"],
                metadataOnly: false,
                routeOnly: false,
            },
            remark: "VLESS",
        };
    
        // Add the new VLESS inbound and log the result
        let vlessInbound = await api.addInbound(inboundConfig);
        console.log("New VLESS inbound has been added:", vlessInbound);
    
        // Return the subscription name
        return subscriptionName;
    }

    // async addVlessInbound(api) {
    
    //     const subscriptionName = "NL-OCW-VLESS";
    
    
    //     const namespace = uuidv5.URL;
    
    //     const vlessTgChatId = this.generateRandomString(8); // Get ChatId Telegram
    //     const uuid = uuidv5(vlessTgChatId, namespace);
    
    //     const newVlessClient = {
    //         id: uuid,
    //         email: vlessTgChatId,
    //         flow: "xtls-rprx-vision",
    //         enable: true,
    //         subId: subscriptionName,
    //         expiryTime: 1731621567514
            
    //     };
    
    //     const vlessSettings = {
    //         description: "none",
    //         clients: [newVlessClient],
    //     };
    
    //     const vlessTcpSettings = {
    //         acceptProxyProtocol: false,
    //         header: {type: "none"},
    
    //     };
    
    //     const { publicKey, privateKey } = this.genPubPrivRealityKeys();
    //     const shortIds = this.genShortIdsForReality(8);
    
    //     const realitySettings = {
    //     show: false,
    //     xver: 0,
    //     dest: "telegram.org:443",
    //     serverNames: ["www.telegram.org"],
    //     privateKey: privateKey,
    //     shortIds: shortIds,
    //     settings: {
    //         fingerprint: "ios",
    //         spiderX: "/",
    //         publicKey: publicKey,
    //     },
    //     };
    
    //     const streamSettings = {
    //     security: "reality",
    //     network: "tcp",
    //     tcpSettings: vlessTcpSettings,
    //     realitySettings: realitySettings,
    //     };
    
    //     const inboundConfig = {
    //     enable: true,
    //     port: 443,
    //     protocol: "vless",
    //     settings: vlessSettings,
    //     streamSettings: streamSettings,
    //     sniffing: {
    //         enabled: false,
    //     },
    //     remark: "VLESS",
    //     };
    
    //     let vlessInbound = await api.addInbound(inboundConfig);
    //     console.log("New VlESS inbound has added:", vlessInbound);
    
    //     return subscriptionName;
    // }
    
    
    // async addShadowSocksInbound(api) {
    
    //     const subscriptionName = "NL-OCW-SS";
    
    //     const ssTgChatId = generateRandomString(8); // Пример: 'bey8lwwhi'
    
    //     const newSsClient = {
    //       email: ssTgChatId,
    //       password: crypto.randomBytes(32).toString("base64"),
    //       enable: true,
    //       subId: subscriptionName,
    //       expiryTime: 1731621567514
    //     };
    
    //     const ssSettings = {
    //       method: "2022-blake3-aes-256-gcm",
    //       password: crypto.randomBytes(32).toString("base64"),
    //       network: "tcp,udp",
    //       clients: [newSsClient],
    //     };
    
    //     const ssStreamSettings = {
    //       network: "tcp",
    //       security: "none",
    //     };
    
    //     const ssSniffingSettings = {
    //       enabled: true,
    //       destOverride: ["http", "tls"],
    //       metadataOnly: false,
    //       routeOnly: false,
    //     };
    
    //     const ssInboundConfig = {
    //       enable: true,
    //       port: randomInt(20000, 60000),
    //       protocol: "shadowsocks",
    //       settings: ssSettings,
    //       streamSettings: ssStreamSettings,
    //       sniffing: ssSniffingSettings,
    //       remark: "SS",
    //     };
    
    //     let ssInbound = await api.addInbound(ssInboundConfig);
    //     console.log("New ShadowSocks inbound has added:", ssInbound);
    
    //     return subscriptionName;
    // }



    


    async getSubDuration(api, tgchatid){

        const clientOptions = await api.getClientOptions(tgchatid);
        const duration = clientOptions.expiryTime;
        console.log(duration);
        
        return duration;

    }

    ovpToDays(ovpCount){

        const daysAdd = Math.floor(ovpCount / 3);
        const millisecondsInDay = 24 * 60 * 60 * 1000; 
        const daysInMilliseconds = daysAdd * millisecondsInDay;
        
        const currentTimestamp = Date.now();
        
        const ovpTodays = daysInMilliseconds;
        
        return ovpTodays;
    }


    async clientUpdateSubDuration(api, tgchatid, ovpCount, type){
    
        let subDuration = await this.getSubDuration(api, tgchatid);
        
        let now = new Date();
        let timestamp = now.getTime();
        
        if(subDuration < timestamp){

            const expiryTime = this.ovpToDays(ovpCount) + timestamp;

            api.updateClient(tgchatid, { expiryTime: expiryTime});

        }
        else{

            const expiryTime = subDuration + this.ovpToDays(ovpCount);

            api.updateClient(tgchatid, { expiryTime: expiryTime });
        }

    }


    // async getSubName(api, inboundId){
        
    //     const inbounds = await api.getInbounds();

    //     let vlessinbound = inbounds.filter((item) => item.protocol === "vless");
    
    //     if (!vlessinbound || vlessinbound.length === 0) {
            
    //         console.error("VLESS has not found. ");
    //         await addVlessInbound(api);
    //         await this.getSubName(api, inboundId);
        
    //     } else {
            
    //         console.log("VLESS inbound has found:", vlessinbound);
    //         const remark = vlessinbound.remark;
    //         if(remark == 'VLESS'){
    //             const subName = "NL-OCW-VLESS"
    //             return subName;
    //         }

    //     }
    
    //     // let ssInbound = inbounds.find((inb) => inb.protocol === "shadowsocks");
    
    //     // if(!ssInbound || ssInbound.length === 0) {

    //     //     console.error("SS has not found. ");
    //     //     await addVlessInbound(api);
    //     //     await this.getSubName(api, inboundId);
    
    //     // } else{

    //     //     console.log("SS inbound has found.", ssInbound); 

    //     //     const remark = ssInbound.remark;
    //     //     if(remark == 'SS'){
    //     //         const subName = "NL-OCW-SS"
    //     //         return subName;
    //     //     } 
    //     // }
    // }
    async addNewClient(api, inboundId, tgchatid, tgUserName, ovpCount, subscriptionName){
        
        const duration = this.ovpToDays(ovpCount);
        console.log(duration);

        const namespace = uuidv5.URL;
        const uuid = uuidv5(tgchatid, namespace);

        api.addClient(inboundId, {
            id: tgchatid,
            email: tgUserName,
            flow: "xtls-rprx-vision",
            enable: true,
            subId: `${subscriptionName}`,
            expiryTime: duration
        });
    }

    async getClient(api, clientId){
        return await api.getClient(clientId);
    }

    async getClientIps(api, clientId){
        return await api.getClientIps(clientId);
    }

    async getClientOptions(api, clientId){
        return await api.getClientOptions(clientId);
    }

    async resetClientIps(api, clientId){
        return await api.resetClientIps(clientId);
    } 
    
    async resetClientStat(api, clientId){
        return await api.resetClientStat(clientId);
    }

    async deleteClient(api, clientId){
        return await api.deleteClient(clientId);
    }

    async getOnlineClients(api, clientId){
        return await api.getOnlineClients(clientId);
    }

    async getInbound(api, inboundId){
        return await api.getInbound(inboundId);
    }

    async resetAllInboundsStat(api){
        return await api.resetAllInboundsStat();
    }

    async resetInboundStat(api, inboundId){
        return await api.resetInboundStat(inboundId);
    }

    async deleteInbound(api, inboundId){
        return await api.deleteInbound(inboundId);
    }

}
export default Vpn;