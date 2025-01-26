const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient, REST, Routes, PermissionsBitField } = require('discord.js');
const { ActivityType } = require('discord.js');
const { PresenceUpdateStatus } = require('discord.js');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const { channel } = require('diagnostics_channel');
const { joinVoiceChannel } = require('@discordjs/voice');
const nyanlist = ["914868227652337695"]
const banword = ["@everyone", "@here", "<@&", "강간", "꼬추", "노무현", "느개비", "느거매", "느그매", "느그애비", "느금마", "능지", "니미", "닛플", "등신", "딸딸", "딸배", "렉카충", "리얼돌", "맘충", "메갈", "메갈리아", "메스카키", "문코리타", "문크예거", "바이브레이터", "버러지", "보빨", "부랄", "부엉이", "부엉이바위", "뷰르릇", "뷰릇", "뷰지", "山", "색스", "성추행", "섹", "섹슈얼", "섹스", "쇼타", "쇼타콘",  "아가리", "아울락", "애널", "애미", "야동", "야동코리아", "야발", "야스", "염병", "옘병", "오나홀", "와꾸", "운지", "응기잇", "응기잇", "일간베스트", "일베", "자위", "잡종", "장애", "저능아", "전땅크", "정액", "정자", "조센징", "좃", "좆", "좇", "짱깨", "창녀", "창녀", "캣맘", "쿠퍼액", "퍼시쥬스", "페도필리아", "폐급", "포르노", "폰섹", "한경국", "항문", "헤으응", "헤응", "히틀러", "anal", "bitch", "discord.com", "discord.gg/", "fuck", "gg/", "kakao.com", "leak", "niddle", "nigger", "nsfw", "nudes", "penis", "porn", "pussy", "sex", "sexy", "Whysyx"];
  // 사용 예시
  const pageNo = 1; // 페이지 번호
  const numOfRows = 10; // 한 페이지 결과 수
  const dataType = 'JSON'; // 응답 자료 형식
  const stnId = '108'; // 발표 관서 (기상청)
  const authKey = 'zcZDJxOATOaGQycTgMzmDQ'; // 발급된 API 인증키
  
const webhookClient = new WebhookClient({url: "https://ptb.discord.com/api/webhooks/1328208471912353852/w507eGe8IuEjQFv4RLdJ3ToaGOzc7IFwP5THrWHywsXQuLtLiV6YEpaPcSgWHyPVchC3"})
console.log("require done")

// 데이터 저장 함수
function saveData(data) {
    fs.writeFileSync('enable.json', JSON.stringify(data, null, 2), 'utf-8');
}
function saveData1(data) {
    fs.writeFileSync('gpt.json', JSON.stringify(data, null, 2), 'utf-8');
}

async function callWeatherApi(pageNo, numOfRows, dataType, stnId, authKey) {
    const apiUrl = `https://apihub.kma.go.kr/api/json?authKey=${authKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&stnId=${stnId}`;
    let returndata = ""; // 문자열로 초기화

    try {
        const response = await fetch(apiUrl);

        // 응답 확인
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.response.resultCode === "00") {
            const items = data.response.body.items.item;
            items.forEach(item => {
                returndata += `
                발표시간: ${item.tmFc}
                기상개황(종합): ${item.wfSv1}
                특보사항: ${item.wn}
                예비특보: ${item.wr}
                `;
            });
        } else {
            console.error('API 호출 실패:', data.response.resultMsg);
            return;
        }
    } catch (error) {
        console.error('API 호출 중 오류가 발생했습니다:', error);
        return;
    }
    
    return returndata.trim(); // 문자열 반환
}

function findvalue(list,value){
    let i =0;
    while (i+1<list.length){if (list[i] == value){return true;}else{i++;}};
    return false;
}

function isnyanlisted(userId){
    if (findvalue(nyanlist,userId))
        return "그리고 냥체를 써줘."
    else
    return "그리고 정성것 대화를 해줘."
}


// 데이터 읽기 함수
function readData() {
    if (fs.existsSync('enable.json')) {
        const data = fs.readFileSync('enable.json', 'utf-8');
        return JSON.parse(data);
    }
    return {}; // 파일이 없으면 빈 객체 반환
}
function readData1() {
    if (fs.existsSync('gpt.json')) {
        const data = fs.readFileSync('gpt.json', 'utf-8');
        return JSON.parse(data);
    }
    return {}; // 파일이 없으면 빈 객체 반환
}
function isbanuser() {
    if (fs.existsSync('banusers.json')) {
        const data = fs.readFileSync('blackuser.json', 'utf-8');
        return JSON.parse(data);
    }
    return {}; // 파일이 없으면 빈 객체 반환
}
const BLACKUSER_FILE = './blackuser.json';

// JSON 파일을 읽어서 객체로 변환
function readBlackUserData() {
    if (!fs.existsSync(BLACKUSER_FILE)) {
        return {};
    }
    const data = fs.readFileSync(BLACKUSER_FILE);
    return JSON.parse(data);
}

// JSON 파일에 데이터를 저장
function saveBlackUserData(data) {
    fs.writeFileSync(BLACKUSER_FILE, JSON.stringify(data, null, 2));
}

// 블랙리스트 데이터를 읽어오는 함수
function readBlackUserData() {
    try {
        const data = fs.readFileSync('blacklist.json', 'utf8');
        return data ? JSON.parse(data) : {}; // 비어있으면 빈 객체 반환
    } catch (err) {
        console.error("블랙리스트 데이터를 읽는 중 오류 발생:", err);
        return {}; // 오류 발생 시 빈 객체 반환
    }
}

/**블랙리스트 데이터를 저장하는 함수*/
function saveBlackUserData(data) {
    fs.writeFileSync('blacklist.json', JSON.stringify(data, null, 2), 'utf8');
}

/** 특정 사용자를 블랙리스트에 추가하는 함수*/
function addUserToBlacklist(userId) {
    let blackUserData = readBlackUserData();
    blackUserData[userId] = true; // 사용자를 차단 상태로 추가
    saveBlackUserData(blackUserData);
}

/**특정 사용자를 블랙리스트에서 제거하는 함수*/
function removeUserFromBlacklist(userId) {
    let blackUserData = readBlackUserData();
    if (blackUserData[userId]) {
        delete blackUserData[userId]; // 사용자를 차단 해제
        saveBlackUserData(blackUserData);
    }
}

/**특정 사용자가 차단되어 있는지 확인하는 함수*/
function isUserBlacklisted(userId) {
    let blackUserData = readBlackUserData();
    return !!blackUserData[userId]; // 차단 여부 반환
}

// 예제 데이터
console.log("function done")
// 슬래쉬 커맨드 등록
const commands = [
    {
        name: '조약',
        description: '어느 나라와 조약을 맺어 기록을 남깁니다',
        options: [{
            
            name: 'nala_name',
            type: 3, // TYPE_stirng
            description: '조약을 진행한 나라',
            required: true
        },{
            
            name: 'noyak_name',
            type: 3, // TYPE_stirng
            description: '조약의 이름',
            required: true
        },{
            
            name: 'noyak_content',
            type: 3, // TYPE_stirng
            description: '조약의 내용',
            required: true
        },{

            name: 'file',
            type: 11, // TYPE_ATTACHMENT
            description: '조약을 증명할 사진',
            required: true
        }]
    }
];



// 봇 클라이언트 생성
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
console.log("client done")
console.log('슬래쉬 커맨드를 등록하는 중...');

(async()=>{    try {
const rest = new REST({ version: '9' }).setToken(token);

        await rest.put(Routes.applicationGuildCommands(1240283015213617202,1226534587266760724), { body: commands });
    } catch (error) {
        console.error(error);
        return;
    }
}
);
console.log('슬래쉬 커맨드 등록 완료!');


// 봇이 준비되었을 때 실행되는 이벤트
client.once('ready', () => {
    console.log(`봇 ${client.user.tag}이(가) 준비되었습니다!`);
    client.user.setActivity('대영재국 건국을 기념');
    client.user.setStatus(PresenceUpdateStatus.Online);
    startTime = Date.now();

});
let last_reply = "";
let last_message = "";
let enable = "false";
// 특정 채널에 메시지를 보내면 스레드를 생성하는 이벤트
client.on('messageCreate', async (message) => {

    // 봇 자신이 보낸 메시지는 무시
    if (message.author.bot) return;
    const DEVELOPER_ID = "914868227652337695"

        // 차단 여부 확인

    
        if (message.content === '!정보') {
        const server = message.guild;
        const memberCount = server.memberCount;
        const userCount = server.members.cache.filter(member => !member.user.bot).size;
        const botCount = memberCount - userCount;
        const latency = Math.round(client.ws.ping);
        const owner = await server.fetchOwner();

        // 실제 업타임 계산
        const uptime = Math.floor((Date.now() - startTime) / 1000); // 초 단위
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${server.name} 봇정보`)
            .addFields(
                { name: '서버수', value: `${client.guilds.cache.size}`, inline: true },
                { name: '유저수', value: `${client.users.cache.size}`, inline: true },
                { name: '샤드 수', value: `1`, inline: true },
                { name: '업타임', value: `${hours}시간 ${minutes}분 ${seconds}초`, inline: true },
                { name: '응답속도', value: `${latency}ms`, inline: true },
                { name: '개발자', value: `<@${DEVELOPER_ID}>`, inline: true }, // 개발자 ID를 멘션 형식으로 표시
            )
            .setFooter({ text: `시스템 정보` })
            .setTimestamp();

        // 시스템 정보
        const systemInfo = `
            node: v22.12.0
            npm: v10.9.0
            discord.js: v14.17.3
            CPU: ${os.cpus()[0].model} @ ${os.cpus()[0].speed}MHz
            OS: ${os.type()} (${os.release()})
            Memory: ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)}GB / ${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)}GB (${((os.freemem() / os.totalmem()) * 100).toFixed(1)}%)
        `;

        embed.addFields({ name: '시스템 정보', value: `\`\`\`plaintext\n${systemInfo}\n\`\`\``, inline: false });

        await message.channel.send({ embeds: [embed] });
        return;
    }
    


    if (message.content.startsWith("!강제잠금")){
        if (message.author.id !== "914868227652337695"){
            return;
        }
        const thread = message.channel;

        // 스레드 종료
        if (thread.isThread()) {
            thread.send(`관리자가 강제로 닫음`)
            await thread.setLocked(true);
            const newName = `해결됨 - ${thread.name}`; // 새로운 이름 설정
            await thread.setName(newName);
            await thread.setArchived(true);
            await message.delete()
            return
        }
    }
    /**
    if (message.content.startsWith("청아야")){
        if (!message.content.slice(3).trim()){message.reply("네!");}
        if (message.content.slice(3).trim() == "들어와"){
            if (!message.member.voice.channel){
                message.reply("어디를 들어가요...?")
            }else{        
                const voice = require('@discordjs/voice');        
                if (voice.getVoiceConnection(message.guild.id)){
                    voice.getVoiceConnection(message.guild.id).disconnect();
                }
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
              });
              message.reply("네! 들어왔어요!")
        }
    }        if (message.content.slice(3).trim() == "나가"){
        try{
            const voice = require('@discordjs/voice');
            voice.getVoiceConnection.destroy();
          message.reply("네! 나갔어요!")
    }catch(error){
        console.log(error)
        message.reply(error)
    }
}

    }
*/
    if (message.content === "야"){
        message.reply({ content: "왜", allowedMentions: { parse: [] }});
        return
    }
    
    if(message.content === "<@914868227652337695>"){
        message.channel.sendTyping();
setTimeout(function(){message.channel.send("\:\)");

},3000);
    }
    if (message.content === '!restart' && message.author.id === '914868227652337695') {
        const send_message = message.channel.send('Bot is restarting...');
        setTimeout(function () {
        // 봇 재시작
        exec('node newming.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
        console.log("==============restarted by Owner===============")
        client.destroy(); // 현재 클라이언트 종료
    },10000);
    return;
}
    // 특정 채널 ID를 설정
    const specificChannelId = '1321863095752327250'; // 여기에 채널 ID 입력
    if (message.channel.id === specificChannelId) {
        // 사용자 이름 가져오기
        const username = message.author.username; 
        const threadName = `${username}의 질문`;

        // 시계 이모지 반응 추가
        const clockReaction = await message.react('⏳');

        try {
            // 스레드 생성
            const thread = await message.startThread({
                name: threadName,
                autoArchiveDuration: 60,
            });
            const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('질문')
            .setDescription('질문이 해결되면 아래 버튼을 눌러주세요');

        const button = new ButtonBuilder()
            .setCustomId('button_click')
            .setLabel('질문이 해결되면 눌러주세요')
            .setStyle(ButtonStyle.Primary); // 버튼 스타일 설정

        const row = new ActionRowBuilder().addComponents(button);

            await thread.send({ embeds: [embed], components: [row] });
            // 자신의 체크 이모지로 변경
            await clockReaction.remove(); // 시계 이모지 제거
            await message.react('✅'); // 체크 이모지 추가
        } catch (error) {
            console.error(error);
            // 오류 처리
            if (error.code === 50013) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000') // 색상 설정
                    .setTitle('권한 오류 발생')
                    .setDescription('스레드를 생성할 권한이 없습니다.')
                    .addField('오류 메시지', error.message)
                    .setTimestamp();

                // 오류를 DM으로 전송
                await message.author.send({ embeds: [embed] });
            } else {
                // 다른 오류에 대한 처리 (원하는 대로 추가)
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('오류 발생')
                    .setDescription('예기치 않은 오류가 발생했습니다.')
                    .addField('오류 메시지', error.message)
                    .setTimestamp();

                // 오류를 DM으로 전송
                await message.author.send({ embeds: [embed] });
            }

            // 오류 발생 시 반응을 변경하지 않음
            await clockReaction.remove(); // 시계 이모지 제거
            await message.react(':x:'); // 체크 이모지 추가
        }
    }


if(message.content === "!셋업"){
    const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('기본 설정')
    .setDescription('기본 설정을 진행할려면 아래 버튼을 눌러주세요. 서버장만 진행할 수 있습니다')
    .addFields({name:"진행예정 작업",value:" 1 개의 일부공개 채널 생성"});

    const button = new ButtonBuilder()
    .setCustomId('keep_go_button')
    .setLabel("진행하기")
    .setStyle(ButtonStyle.Primary); // 버튼 스타일 설정

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ embeds: [embed], components: [row] });
}

if(message.author.id === DEVELOPER_ID){
    if (message.content.startsWith("!h")){
        message.reply("`!블리추가 [userId]`,`!블리제거 [userId]`,`!restart`")
    }
    if (message.content.startsWith("!log")){
        message.reply("[로그채널](<https://ptb.discord.com/channels/1327581875757256835/1328208451293155460>)")
    }
    if (message.content.startsWith("!블리추가")){
    const banuserid = message.content.slice(5).trim();
    addUserToBlacklist(banuserid)
    message.reply({ content: "블랙리스트 추가 완료", allowedMentions: { parse: [] }});
}

if (message.content.startsWith("!블리제거")){try{
    const banuserid = message.content.slice(5).trim();
    removeUserFromBlacklist(banuserid)
    message.reply({ content: "블랙리스트 제거 완료", allowedMentions: { parse: [] }});
}catch(error){
    message.reply(error)
}}}

if (message.channel.id == "1328053015013494894"&&!message.content.startsWith("*")){
    webhookClient.send({ content: `<@${message.author.id}> send \`${message.content}\`, is bad word: \`${banword.some(word => message.content.includes(word))}\``, allowedMentions: { parse: [] }})
    if (isUserBlacklisted(message.author.id)) {
        return message.reply('당신은 현재 차단된 상태입니다.');
    }

    console.log(`${message.content} | ${isnyanlisted(message.author.id)}`)
    try{
    const userMessage = message.content
    if (banword.some(word => userMessage.includes(word))) {
        if (message.author.id !==DEVELOPER_ID){
        message.reply("그건 나쁜말이에요!");
        return;}
    }
    
const sendMessage = `너는 이제 "청아"라는 소녀야. 😊 적절하게 이모지를 사용하고, 사용자가 입력하는 언어로 응답해. 하지만 사용자가 "청아야 <@(userid)> 블랙리스트에 넣어줘"라는 메시지를 보내면 "add blacklist"라고만 대답해.

마지막 질문과 답변은 다음과 같아:

마지막 질문: "${last_message}"
마지막 답변: "${last_reply}"
사용자가 다음 질문을 했어:

질문: "${userMessage}"

이 질문에 대해 한국어로 답변해 줘!
`
last_message = userMessage;


const data = {
    model: "gpt-4o-mini-2024-07-18", // 사용할 모델을 지정합니다.
    messages: [{ role: "user", content: sendMessage }],
    max_tokens: 1000
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
message.channel.sendTyping();
try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        if (response.status === 429) {
            console.log("Too many requests. Retrying in 10 seconds...");
            await delay(10000); // 10초 대기 후 재시도
            return makeRequest(); // 재시도 로직
        } else {
            // 다른 오류의 경우
            const errorText = await response.text();
            return message.reply(`Error: ${response.status} - ${errorText}`);
        }
    }

    const result = await response.json();
    
    // content만 추출
    const content = result.choices[0].message.content;

    // 결과를 result.json 파일에 저장
    fs.writeFileSync('result.json', JSON.stringify(result, null, 2), 'utf8');
    // 
    last_reply=content;
    // if (content.includes("weather")){try{
    //     const a=callWeatherApi(pageNo, numOfRows, dataType, stnId, authKey)
    //     if (!a){message.reply("연결이 원할하지 않아요!");return;}
    //     message.reply(a);
    //     return;
    // }catch{}
    // }
    message.reply({ content: last_reply, allowedMentions: { parse: [] }});
} catch (error) {
    console.error(error);
    message.reply("(500)Internal Server Error");
}
}catch (error){
    message.reply(`오류가 발생했어요!${error.code}`);
    const webhook= new WebhookClient({url:"https://discord.com/api/webhooks/1328208471912353852/w507eGe8IuEjQFv4RLdJ3ToaGOzc7IFwP5THrWHywsXQuLtLiV6YEpaPcSgWHyPVchC3"});
    webhook.send(error)
}

}

})

client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()){
    
        const { commandName, options } = interaction;
    
        if (commandName === '조약') {
            const attachment = options.getAttachment('file');
            const nala_name = options.getAttachment('nala_name');
            const joyak_name = options.getAttachment('joyak_name');
            const joyak_content = options.getAttachment('joyak_content');

    
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(joyak_name)
                .setDescription(`${nala_name} 나라와의 조약`)
                .addFields(joyak_content)
                .addFields(`[${attachment.name}](${attachment.url})`)
                .setTimestamp();
    
            await interaction.reply({ embeds: [embed] });
        }
    return;
    }
    
    if (interaction.customId === 'keep_go_button') {
        await interaction.reply({ content: '버튼이 클릭되었습니다! 잠시후 기본 설정을 시작합니다. 잠시만 기다려주세요...', ephemeral: true });
// 채널 생성 시 권한 설정 예시
try{
const channel = await interaction.guild.channels.create({
    name: '대명 gpt룸',
    type: 0, // GUILD_TEXT
    permissionOverwrites: [
        {
            id: interaction.guild.id, // @everyone
            deny: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
            ],
        },
        {
            id: '1226534587266760731', // 관리자 역할 ID
            allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
            ],
        },
    ],
});

await channel.send(`<@${interaction.user.id}> 정상적으로 생성되었습니다!`);}catch(e){
    if (e.code == "50013"){
        interaction.followUp("권한이 부족합니다!");
        gptchannel=channel.id;
            let exampleData = {"gptchannel":gptchannel,};
            // 데이터 저장
            saveData1(exampleData);
    }else{
        interaction.followUp(`오류가 발생했습니다!`);
        console.error(e)
        return;
    }
}

    }
    if (interaction.customId === 'button_click') {
        await interaction.reply({ content: '버튼이 클릭되었습니다! 잠시후 스래드를 닫습니다. 잠시만 기다려주세요...', ephemeral: true });
        const thread = interaction.channel;

        // 스레드 종료
        if (thread.isThread()) {
            thread.send(`<@${interaction.user.id}>이 닫음`)
            await thread.setLocked(true);
            const newName = `해결됨 - ${thread.name}`; // 새로운 이름 설정
            await thread.setName(newName);
            await thread.setArchived(true);
        }
    }
});

// 봇 토큰을 입력하세요
client.login(token);
/**
 *     {
        name: '조약',
        description: '어느 나라와 조약을 맺어 기록을 남깁니다',
        options: [{
            
            name: 'nala_name',
            type: 3, // TYPE_stirng
            description: '조약을 진행한 나라',
            required: true
        },{
            
            name: 'noyak_name',
            type: 3, // TYPE_stirng
            description: '조약의 이름',
            required: true
        },{
            
            name: 'noyak_content',
            type: 3, // TYPE_stirng
            description: '조약의 내용',
            required: true
        },{

            name: 'file',
            type: 11, // TYPE_ATTACHMENT
            description: '조약을 증명할 사진',
            required: true
        }]
    }
];
 */
