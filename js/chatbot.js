(function() {
  const RESPONSES = [
    { p:/service|offer|do you do|what can/i,         r:"We offer 9 core AI/ML services:\n\n• Machine Learning Development\n• Deep Learning & Neural Networks\n• Natural Language Processing\n• Computer Vision\n• Predictive Analytics\n• Robotic Process Automation\n• MLOps & Cloud AI\n• Conversational AI\n• AI Security & Fraud Detection\n\nWhich area interests you most?" },
    { p:/price|cost|pricing|how much|budget|starter|professional|enterprise/i, r:"Our pricing starts at <strong>$2,999</strong> for the Starter plan (1 ML model, up to 100K records).\n\nOur most popular Professional plan is <strong>$9,999</strong> (up to 5 models, 5M records, real-time monitoring).\n\nEnterprise is <strong>custom pricing</strong> for unlimited scale.\n\nAll plans include NDA + IP ownership transfer + 30-day money-back. Want a free consultation?" },
    { p:/how long|timeline|duration|time|week|month/i, r:"Project timelines depend on complexity:\n\n• Starter MVP — <strong>4–8 weeks</strong>\n• Mid-scale production model — <strong>2–4 months</strong>\n• Full enterprise AI transformation — <strong>4–12 months</strong>\n\nWe follow a 6-step process: Discovery → Data → Model Dev → Evaluation → Deployment → Monitoring." },
    { p:/secur|data|privacy|gdpr|compliance|nda|confidential/i, r:"Security is our top priority:\n\n🔒 NDA signed before any data sharing\n🔒 SOC 2 Type II compliant infrastructure\n🔒 GDPR & HIPAA capable pipelines\n🔒 End-to-end encryption at rest & in transit\n🔒 IP ownership fully transferred to client\n🔒 Option for on-premise deployment" },
    { p:/health|hospital|medical|clinic|pharma|radiol/i, r:"Healthcare is one of our strongest verticals:\n\n🏥 Medical imaging AI (radiology, pathology)\n🧬 Drug discovery accelerators\n📋 Clinical NLP for notes & EHR\n🔬 Genomics data analysis\n\nOur work with Apollo Hospitals improved diagnostic accuracy by 40%. We're HIPAA-compliant." },
    { p:/nlp|natural language|text|chatbot|language|sentiment/i, r:"Our NLP capabilities include:\n\n💬 Custom LLM fine-tuning (GPT-4, LLaMA, Mistral)\n🌍 Multilingual support (50+ languages)\n📄 Document intelligence & extraction\n😊 Sentiment & intent analysis\n🤖 Production chatbots & virtual agents\n📧 Email/ticket classification" },
    { p:/computer vision|image|video|object detect|cv|yolo|ocr/i, r:"Our Computer Vision team specialises in:\n\n👁 Object detection & tracking (YOLO, Detectron2)\n🏭 Industrial quality inspection (89% defect reduction)\n🏥 Medical imaging analysis\n📝 OCR & document digitisation\n🎥 Real-time video analytics at 60fps" },
    { p:/mlops|deploy|cloud|aws|azure|gcp|pipeline|monitor/i, r:"Our MLOps & Cloud AI services:\n\n☁️ Cloud deployment (AWS SageMaker, Azure ML, GCP)\n🔄 CI/CD pipelines for ML models\n📊 Real-time model monitoring & drift detection\n⚡ Auto-retraining on data drift\n📦 Docker + Kubernetes orchestration\n\nWe cut deployment time from weeks to hours." },
    { p:/team|engineer|expert|phd|experience/i, r:"Our team of 50+ AI experts includes:\n\n👨‍🔬 Dr. Arjun Kumar — CEO, IIT Bombay PhD, ex-Google Brain\n👩‍💻 Priya Sharma — CTO, ex-Amazon & Microsoft\n👁 Rahul Nair — Head of Computer Vision\n📊 Sneha Menon — Lead Data Scientist, Kaggle Grandmaster\n\n10+ years, 500+ projects, 20 industries." },
    { p:/contact|talk|call|demo|consult|meet|schedule/i, r:"I'd love to connect you with our team!\n\n📅 <strong>Free 1-hour consultation</strong> — no commitment\n📧 hello@n-infotech.ai\n📞 +91 98765 43210\n🕐 Mon–Fri, 9 AM – 7 PM IST\n\nScroll down to our Contact form and we'll respond within 24 hours with a tailored proposal." },
    { p:/fraud|bank|finance|fintech|transaction|anomaly/i, r:"We've built fraud detection for major banks:\n\n💳 Real-time transaction scoring (<5ms latency)\n📈 1M+ transactions/hour throughput\n🎯 76% fraud loss reduction (HDFC Bank)\n🔍 Behavioral anomaly detection\n📊 Explainable AI for compliance teams" },
    { p:/roi|return|benefit|result|outcome|impact/i, r:"Our average client ROI in Year 1:\n\n📈 <strong>340% average ROI</strong> across all projects\n💰 $12M inventory savings (Reliance Retail)\n🚫 76% fraud reduction (HDFC Bank)\n⚡ 10x faster model deployment (Infosys)\n🏭 89% fewer manufacturing defects (Tata)" },
  ];
  const FALLBACK = "That's a great question! Our team would be best placed to answer that in depth.\n\nI'd recommend a <strong>free 1-hour consultation</strong> — reach us at hello@n-infotech.ai or scroll down to the contact form. Anything else I can clarify?";
  const QUICK = ["What services do you offer?","How much does ML development cost?","How long does a project take?","Can you handle our data securely?","Do you work with healthcare clients?"];

  let open = false, unread = 1, msgCount = 0, hasOpened = false;
  const win   = document.getElementById('chatWindow');
  const msgs  = document.getElementById('chatMessages');
  const qr    = document.getElementById('chatQuickReplies');
  const input = document.getElementById('chatInput');
  const badge = document.getElementById('chatBadge');
  const fabBtn= document.getElementById('chatFabBtn');
  const rings = document.querySelectorAll('.chat-pulse-ring,.chat-pulse-ring-2');

  function fmtTime(){ return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }

  function markdownToHTML(t){
    return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  }

  function addMsg(from, text) {
    msgCount++;
    const d = document.createElement('div');
    if (from === 'bot') {
      d.className = 'chat-msg-bot';
      d.innerHTML = `<div class="chat-bot-mini">🤖</div><div class="chat-bubble-bot">${markdownToHTML(text)}</div>`;
    } else {
      d.className = 'chat-msg-user';
      d.innerHTML = `<div class="chat-bubble-user">${text}</div>`;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    // hide quick replies after 3 messages
    if (msgCount >= 4) qr.style.display = 'none';
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'chat-msg-bot'; d.id = 'chatTyping';
    d.innerHTML = `<div class="chat-bot-mini">🤖</div><div class="chat-bubble-bot" style="padding:12px 16px"><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('chatTyping');
    if (t) t.remove();
  }

  function matchReply(text) {
    for (const r of RESPONSES) if (r.p.test(text)) return r.r;
    return FALLBACK;
  }

  function sendMsg(text) {
    if (!text.trim()) return;
    input.value = '';
    addMsg('user', text);
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMsg('bot', matchReply(text));
    }, 900 + Math.random() * 600);
  }

  function buildQuickReplies() {
    qr.innerHTML = '';
    QUICK.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = q;
      btn.onclick = () => sendMsg(q);
      qr.appendChild(btn);
    });
  }

  function toggleChat() {
    open = !open;
    if (open) {
      win.classList.remove('hidden');
      win.style.animation = 'none';
      void win.offsetWidth;
      win.style.animation = 'chatSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) both';
      unread = 0;
      badge.style.display = 'none';
      rings.forEach(r => r.style.display = 'none');
      fabBtn.classList.add('open');
      fabBtn.innerHTML = '<i class="fas fa-times"></i>';
      hasOpened = true;
      setTimeout(() => input.focus(), 300);
    } else {
      win.classList.add('hidden');
      fabBtn.classList.remove('open');
      fabBtn.innerHTML = `<i class="fas fa-comment-dots"></i>`;
      if (!hasOpened) {
        badge.style.display = 'flex';
        badge.textContent = unread;
        rings.forEach(r => r.style.display = 'block');
      }
    }
  }

  // Initial greeting
  addMsg('bot', "Hi! I'm <strong>ARIA</strong>, N-Infotech's AI assistant 👋\n\nI can tell you about our services, pricing, timelines, or technology. What would you like to know?");
  buildQuickReplies();

  // Proactive message after 8s
  setTimeout(() => {
    if (!hasOpened) {
      addMsg('bot', "👋 Curious about AI pricing or timelines? Ask me anything — I'm here to help!");
      unread++;
      badge.textContent = unread;
    }
  }, 8000);

  fabBtn.addEventListener('click', toggleChat);
  document.getElementById('chatClose').addEventListener('click', toggleChat);
  document.getElementById('chatSend').addEventListener('click', () => sendMsg(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(input.value); });
})();
