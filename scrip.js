let _speechSynth
let _voices
const _cache = {}
// let flag = false;

/**
 * retries until there have been voices loaded. No stopper flag included in this example. 
 * Note that this function assumes, that there are voices installed on the host system.
 */

function loadVoicesWhenAvailable (onComplete = () => {}) {
  _speechSynth = window.speechSynthesis
  const voices = _speechSynth.getVoices()

  if (voices.length !== 0) {
    _voices = voices
    onComplete()
  } else {
    return setTimeout(function () { loadVoicesWhenAvailable(onComplete) }, 100)
  }
}

/**
 * Returns the first found voice for a given language code.
 */

function getVoices (locale) {
  if (!_speechSynth) {
    throw new Error('Browser does not support speech synthesis')
  }
  if (_cache[locale]) return _cache[locale]

  _cache[locale] = _voices.filter(voice => voice.lang === locale)
  return _cache[locale]
}

/**
 * Speak a certain text 
 * @param locale the locale this voice requires
 * @param text the text to speak
 * @param onEnd callback if tts is finished
 */

function playByText (locale, text, onEnd) {
  const voices = getVoices(locale)

  // TODO load preference here, e.g. male / female etc.
  // TODO but for now we just use the first occurrence
  const utterance = new window.SpeechSynthesisUtterance()
  utterance.voice = voices[0]
  utterance.pitch = 1
  utterance.rate = 1
  utterance.voiceURI = 'native'
  utterance.volume = 1
  utterance.rate = 1
  utterance.pitch = 0.8
  utterance.text = text
  utterance.lang = locale

  if (onEnd) {
    utterance.onend = onEnd
  }

  _speechSynth.cancel() // cancel current speak, if any is running
  _speechSynth.speak(utterance)
}

// on document ready
loadVoicesWhenAvailable(function () {
 console.log("loaded") 
})

function speak () {
  setTimeout(() => playByText("en-UK", "Hello Looper"), 300)
}

let open_response

let chat=[ 
    { role :"user",content:"hi" },
    { role:"assistant", content: "hi , how can i help you "}
]

 async function chatUserAdd ( feeling,question) { 
    chat.push( {role:"user" ,content:" my hapiness from 0-10: " + feeling + ". my input is :"+ question})
} 
  
async function chatAssistentAdd ( res) { 
    chat.push({role:"assistant" ,content:res });
} 

async function openai_test( ){



let url = "https://api.openai.com/v1/chat/completions";

let part1 = "sk";
let part2 = "-LLDtZIQbt300rIyi";
let part3 = "Bm5LT3BlbkFJwntYQJzMl3xlkgLt63pM";
let apikey = part1 + part2 + part3 

let data = { 
    model:"gpt-3.5-turbo",
    messages:chat 
};

try {
    const response = await fetch ( url , { 
      method:"POST",
      headers:{ 
        "Content-Type":"application/json",
        Authorization : `Bearer ${apikey}`
      } ,
      body: JSON.stringify(data) 
    })

  if (response.ok)
    {
    const  responseData = await response.json();
    const message = responseData.choices[0].message.content;

    chatAssistentAdd (message);

    const speech = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak( speech);
    return message;
    }




}
catch (error) {
    console.log( "opps new error:"+ error);
}
}
