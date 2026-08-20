
// Aonix Studio — site scripts

// i18n: translates every [data-i18n] element between English (the
// language baked into the HTML) and Ukrainian. Plain elements get
// their textContent replaced; elements carrying [data-i18n-html] get
// innerHTML instead, since their source markup wraps part of the
// string in <span class="gradient-text">/.muted>/<br> etc. and a
// plain-text swap would blow that formatting away. [data-i18n-attr]
// handles attributes (currently just placeholder=) the same way, via
// an "attr:key" spec. Choice is remembered in localStorage and
// reapplied on load — runs first, synchronously, so every later
// module (the statement word-fill, the contact form) sees the
// already-resolved language instead of racing it.
const AonixI18N = (function () {
  const STORAGE_KEY = 'aonixLang';

  const STRINGS = {
    en: {
      'meta.title': 'Aonix Studio — Custom Websites for Small Businesses',
      'meta.description': "We design custom websites for small businesses that don't look like AI-generated templates. UX research, hand-written code, launched in weeks.",
      'dockLogo.aria': 'Aonix Studio — Home',
      'nav.projects': 'Our Projects',
      'nav.pricing': 'Pricing',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact us',
      'burger.aria': 'Menu',
      'hero.badge1': 'FullStack Development',
      'hero.badge2': 'UX/UI Design',
      'hero.heading': 'We design websites for small businesses that <span class="gradient-text">don’t</span> look like everyone <span class="muted">else’s AI-generated template</span>',
      'hero.note': 'Every layout starts with UX research, not a template picker – so your site actually looks like your business, not a template.',
      'proj.cursorLabel': 'See the project',
      'proj1.title': 'Xionik - Digital',
      'proj1.desc': 'Xionik is a website for a digital company offering AI systems and intelligent business solutions. The goal was a unique, immersive design that makes the business memorable',
      'proj1.tagType': 'Landing Page',
      'proj1.tagCat': 'Digital',
      'proj2.title': 'Fovea - Eye Clinic',
      'proj2.desc': 'Fovea is a landing page for an ophthalmology clinic focused on cataracts. The goal was a clean, simple design with minimal effects and animation',
      'proj2.tagType': 'Landing page',
      'proj2.tagCat': 'Eye-clinic',
      'proj3.title': 'PureSmile - Dentistry',
      'proj3.desc': 'PureSmile is a landing page for a modern dental clinic. The goal was to convey a sense of professionalism and trust. We chose a calm color palette and typography to reinforce that feeling.',
      'proj3.tagType': 'Multi-page Website',
      'proj3.tagCat': 'Dentistry',
      'proj4.title': 'Yopavve - Construction',
      'proj4.desc': "Yopavve is a website for a paving company. The goal was to reflect the brand's identity while keeping the design light and easy to use on mobile",
      'proj4.tagType': 'Landing page',
      'proj4.tagCat': 'Paving',
      'proj5.title': 'BurgerHub - Fast Food',
      'proj5.desc': "BurgerHub is a multi-page website for a fast-food restaurant, built to better showcase the brand and its story. The goal was a clean wow-effect and a menu that's easy to navigate",
      'proj5.tagType': 'Multi-page Website',
      'proj5.tagCat': 'Fast Food',
      'proj6.title': 'Kids Care Africa - Volunteering',
      'proj6.desc': 'Kids Care Africa is a volunteering website built to collect donations for children in Africa. Our priority was intuitive navigation and a fast donation process.',
      'proj6.tagType': 'Multi-page Website',
      'proj6.tagCat': 'Volunteering',
      'statement.text': 'Looking good is 10% of the job. The other 90% is the layout, the flow, the moment someone decides to click — all the things visitors never notice, but always feel.',
      'pricing.title': 'Pricing for<br>our services',
      'pricing.note': 'Not sure which one fits? Landing Page works if you need one strong page that does the job. Multi-page makes sense if your business needs more room to explain itself.',
      'pricing.landingTitle': 'Landing Page',
      'pricing.deadline1': 'deadline: 9-15 d',
      'pricing.listLabel': 'You will get',
      'pricing.item.full': 'A fully functional website',
      'pricing.item.ux': 'Custom UX/UI design tailored to your goals',
      'pricing.item.figma': 'Complete Figma design file (if needed)',
      'pricing.item.responsive': 'Responsive Design & Development',
      'pricing.item.seo': 'SEO-friendly website structure',
      'pricing.item.copy': 'Basic Copywriting',
      'pricing.item.edits3': '3 free edits/month (text, images, etc.)',
      'pricing.item.support': 'Support during the first weeks after launch',
      'pricing.buy': 'Discuss the project',
      'pricing.priceLanding': '<span class="gradient-text">$500</span>',
      'pricing.multiTitle': 'Multi-page website',
      'pricing.multiPrice': '<span class="gradient-text">From $900</span>',
      'pricing.deadline2': 'deadline: 15-25 d',
      'pricing.item.edits5': '5 free edits/month (text, images, etc.)',
      'pricing.item.pages': '2-10+ pages',
      'faq.heading': 'Frequently Asked<br>Questions',
      'faq.subtitle': 'Quickly find answers to questions that our clients often ask us',
      'faq.title': '<span class="gradient-text">Still</span> Have Questions?',
      'faq.q1': 'How long does it take to build a website?',
      'faq.a1': 'For Landing Page — 10-15 days.<br>For Multi-page website — 15-21 days, if mini e-commerce then +7 days to work.',
      'faq.q2': 'How is the payment?',
      'faq.a2': 'We take a 50% prepayment, and before launching your site you pay the other 50% — then we launch the site and provide all the necessary files.',
      'faq.q3': 'What if I don’t like the result?',
      'faq.a3': 'Before we start, we discuss your goals, target audience, and references in detail — we don’t open Figma until we have a clear shared vision of the result. During the work, you see progress at every stage, not just the final version, and if something feels off, we fix it immediately. Revisions are included in every package, which is enough to get the result right when we start with a strong brief.',
      'faq.q4': 'Do you only do design or also development?',
      'faq.a4': 'We handle everything: from UX/UI design in Figma to development and launch. You get a ready-to-use website with your own domain — no technical headaches on your side.',
      'faq.q5': 'How will we communicate while working?',
      'faq.a5': 'We communicate via WhatsApp or Telegram — wherever is more convenient for you. You’ll see progress at every stage and can ask questions at any time.',
      'faq.q6': 'Why should I hire you instead of cheap freelancer or AI?',
      'faq.a6': 'We don’t just make websites look good — we think through the logic, structure, and user flow so your site actually converts visitors into buyers. You get a unique design, fast communication, and a team that treats your business like their own.',
      'faq.q7': 'What do you need from me to get started?',
      'faq.a7': 'Just tell us about your business — what you do, who your customers are, and what you want your website to achieve. To get started, prepare your business name, logo, and any photos you’d like on the site. We’ll handle everything else and guide you through every step.',
      'quote.text': 'The <span class="gradient-text">biggest</span> problem with most websites isn’t how they look — it’s <span class="muted">the logic, the comfort of use, the responsive experience, and understanding</span> who they’re actually built for',
      'quote.note': 'We solve exactly that in every project — making sure your potential customers feel comfortable using your site from the very first second.',
      'quote.role': 'UX/UI Designer',
      'marquee.hand': 'Built by hand, not by prompt',
      'marquee.calls': 'Turns visitors into calls',
      'marquee.looks': 'Looks like you, not like everyone',
      'marquee.launch': 'Launch in weeks, not months',
      'cta.heading': 'The longer you wait,<br> the more <span class="dim">money</span> your<br> business <span class="dim">loses</span>',
      'cta.talk': 'Let’s talk',
      'footer.privacy': 'Privacy Policy',
      'modal.heading': 'Contact us',
      'modal.subtitle': 'We will write to you within 24 hours.',
      'modal.close.aria': 'Close',
      'form.name': 'What is your name?',
      'form.email': 'Your email',
      'form.message': 'Message (optional)',
      'form.confirm': 'Confirm',
      'contact.sending': 'Sending…',
      'contact.successMsg': 'Thanks! We’ll get back to you within 24 hours.',
      'contact.genericError': 'Something went wrong — please try again or email us directly.',
      'contact.networkError': 'Network error — please check your connection and try again.',
      'email.copied': 'Copied ✓',
      'privacy.metaTitle': 'Privacy Policy — Aonix Studio',
      'privacy.metaDescription': 'How Aonix Studio collects, uses, and protects your information.',
      'privacy.h1': 'Privacy Policy',
      'privacy.updated': 'Last updated: August 2026',
      'privacy.backTop': '← Back to home',
      'privacy.backBottom': '← Back to home',
      'privacy.s1.title': 'Who we are',
      'privacy.s1.p1': 'Aonix Studio is a design and development studio. Mykhailo Vorona handles UX/UI design, and Jacob Sihul works on full-stack development. We build custom websites for small business. We work remotely from Ukraine and Kenya, which means your data may be processed outside the European Economic Area. We handle it with the same care either way — see the sections below for exactly what we collect and how long we keep it.',
      'privacy.s1.p2': 'This policy explains what happens to your information when you contact us through this website. If you have any questions about it, you can reach us at hello@aonixstudio.com.',
      'privacy.s2.title': 'What information we collect',
      'privacy.s2.p1': 'We collect only what you choose to send us. When you fill in the contact form on this site, we receive your name, your email address, and the message you write.',
      'privacy.s2.p2': 'We do not use analytics, advertising trackers, or cookies that follow you around the web. We do not collect your IP address, browsing history, or any information you have not deliberately given us.',
      'privacy.s3.title': 'How we use your information',
      'privacy.s3.p1': "We use your details for one purpose: to reply to you and to discuss a possible project. That's it.",
      'privacy.s3.p2': 'We do not sell your data, share it with advertisers, or add you to a marketing list. If you contact us and we never work together, your information simply sits unused until it is deleted.',
      'privacy.s4.title': 'Where your data is stored',
      'privacy.s4.p1': 'Contact form submissions are processed by Formspree, a third-party form service, and delivered to our email inbox hosted by Zoho Mail. Both providers store data on their own servers and have their own privacy policies, which we recommend reading if you want the full technical picture.',
      'privacy.s4.p2': 'The website itself is hosted on Vercel. Our domain is registered through Namecheap.',
      'privacy.s5.title': 'How long we keep it',
      'privacy.s5.p1': 'We keep your message for as long as our conversation is ongoing, and for a reasonable period afterwards in case you get back in touch.',
      'privacy.s5.p2': "If we don't work together and there is no reason to keep your details, we delete them. You can also ask us to delete them at any point, and we will.",
      'privacy.s6.title': 'Your rights',
      'privacy.s6.p1': "If you are in the European Union or the United Kingdom, the GDPR gives you the right to access the personal data we hold about you, to correct it if it's wrong, to have it deleted, and to object to how we use it.",
      'privacy.s6.p2': "You don't need to fill in a form or follow a process. Email hello@aonixstudio.com and tell us what you want done. We'll handle it and confirm when it's finished.",
      'privacy.s7.title': 'Contact',
      'privacy.s7.p1': 'For anything related to this policy, or to your data specifically, write to hello@aonixstudio.com.',
      'privacy.s7.p2': 'We may update this policy if we change how the site works — for example, if we add analytics in future. When we do, we’ll change the "last updated" date at the top of this page.',
    },
    uk: {
      'meta.title': 'Aonix Studio — індивідуальні сайти для малого бізнесу',
      'meta.description': 'Ми створюємо індивідуальні сайти для малих бізнесів, які не виглядають як шаблони, згенеровані ШІ. UX-дослідження, код, написаний вручну, запуск за тижні.',
      'dockLogo.aria': 'Aonix Studio — на головну',
      'nav.projects': 'Наші проєкти',
      'nav.pricing': 'Ціни',
      'nav.faq': 'Питання',
      'nav.contact': 'Зв’язатися',
      'burger.aria': 'Меню',
      'hero.badge1': 'Full-Stack розробка',
      'hero.badge2': 'UX/UI дизайн',
      'hero.heading': 'Ми створюємо сайти для малих бізнесів, які <span class="gradient-text">не</span> виглядають як <span class="muted">типовий шаблон, згенерований ШІ, яким користуються ваші конкуренти</span>',
      'hero.note': 'Кожен макет починається з UX-дослідження, а не з вибору шаблону – тому ваш сайт виглядає як ваш бізнес, а не як шаблон.',
      'proj.cursorLabel': 'Переглянути проєкт',
      'proj1.title': 'Xionik — Digital',
      'proj1.desc': 'Xionik — сайт для digital-компанії, яка пропонує AI-системи та розумні бізнес-рішення. Мета — унікальний, занурюючий дизайн, який робить бізнес запам’ятовуваним',
      'proj1.tagType': 'Лендінг',
      'proj1.tagCat': 'Діджитал',
      'proj2.title': 'Fovea — офтальмологічна клініка',
      'proj2.desc': 'Fovea — лендінг для офтальмологічної клініки, що спеціалізується на катаракті. Мета — чистий, простий дизайн з мінімумом ефектів та анімації',
      'proj2.tagType': 'Лендінг',
      'proj2.tagCat': 'Офтальмологія',
      'proj3.title': 'PureSmile — стоматологія',
      'proj3.desc': 'PureSmile — лендінг для сучасної стоматологічної клініки. Мета — передати відчуття професіоналізму та довіри. Ми обрали спокійну кольорову палітру й типографіку, щоб підкреслити це відчуття.',
      'proj3.tagType': 'Багатосторінковий сайт',
      'proj3.tagCat': 'Стоматологія',
      'proj4.title': 'Yopavve — будівництво',
      'proj4.desc': 'Yopavve — сайт для компанії з укладання бруківки. Мета — відобразити ідентичність бренду, зберігаючи легкий і зручний для мобільних дизайн',
      'proj4.tagType': 'Лендінг',
      'proj4.tagCat': 'Бруківка',
      'proj5.title': 'BurgerHub — фастфуд',
      'proj5.desc': 'BurgerHub — багатосторінковий сайт для закладу швидкого харчування, створений, щоб краще розкрити бренд та його історію. Мета — чистий wow-ефект і меню, яким зручно користуватися',
      'proj5.tagType': 'Багатосторінковий сайт',
      'proj5.tagCat': 'Фастфуд',
      'proj6.title': 'Kids Care Africa — волонтерство',
      'proj6.desc': 'Kids Care Africa — волонтерський сайт, створений для збору пожертв дітям в Африці. Наш пріоритет — інтуїтивна навігація та швидкий процес донату.',
      'proj6.tagType': 'Багатосторінковий сайт',
      'proj6.tagCat': 'Волонтерство',
      'statement.text': 'Зробити сайт красиво це лише 10% роботи. Інші 90% — це структура, логіка взаємодії та момент, коли людина вирішує натиснути чи ні - все те, що відвідувачі ніколи не помічають, але завжди відчувають.',
      'pricing.title': 'Ціни на<br>наші послуги',
      'pricing.note': 'Не впевнені, що вам підходить? Лендінг чудово підходить, якщо потрібна одна потужна сторінка, яка виконує свою роботу. Багатосторінковий сайт має сенс, якщо вашому бізнесу потрібно більше простору, щоб розповісти про себе.',
      'pricing.landingTitle': 'Лендінг',
      'pricing.deadline1': 'термін: 9–15 днів',
      'pricing.listLabel': 'Ви отримаєте',
      'pricing.item.full': 'Повністю функціональний сайт',
      'pricing.item.ux': 'Індивідуальний UX/UI дизайн під ваші цілі',
      'pricing.item.figma': 'Повний файл дизайну у Figma (за потреби)',
      'pricing.item.responsive': 'Адаптивний дизайн та розробка',
      'pricing.item.seo': 'SEO-дружня структура сайту',
      'pricing.item.copy': 'Базовий копірайтинг',
      'pricing.item.edits3': '3 безкоштовні правки на місяць (текст, зображення тощо)',
      'pricing.item.support': 'Підтримка протягом перших тижнів після запуску',
      'pricing.buy': 'Обговорити проєкт',
      'pricing.priceLanding': '<span class="gradient-text">21 000 ₴</span>',
      'pricing.multiTitle': 'Багатосторінковий сайт',
      'pricing.multiPrice': '<span class="gradient-text">Від 38 000 ₴</span>',
      'pricing.deadline2': 'термін: 15–25 днів',
      'pricing.item.edits5': '5 безкоштовних правок на місяць (текст, зображення тощо)',
      'pricing.item.pages': '2–10+ сторінок',
      'faq.heading': 'Часті<br>запитання',
      'faq.subtitle': 'Швидко знайдіть відповіді на запитання, які нам часто ставлять клієнти',
      'faq.title': '<span class="gradient-text">Ще є</span> запитання?',
      'faq.q1': 'Скільки часу займає створення сайту?',
      'faq.a1': 'Для лендінгу — 9–15 днів.<br>Для багатосторінкового сайту — 15–25 день',
      'faq.q2': 'Як відбувається оплата?',
      'faq.a2': 'Ми беремо 50% передоплати, а перед запуском сайту ви сплачуєте решту 50% — після цього ми запускаємо сайт і надаємо всі необхідні файли.',
      'faq.q3': 'А якщо мені не сподобається результат?',
      'faq.a3': 'Після дизайну у Figma, якщо ви бачите, що це не те, що вам потрібно, протягом 24 годин ви маєте право відмовитись від проєкту, і я поверну вам кошти — але за умови, що я зможу використати цей дизайн як проєкт у портфоліо (без згадки вашого бізнесу). Щоб дізнатись більше — зв\'яжіться зі мною, і я надам документ, де це описано детальніше.',
      'faq.q4': 'Ви робите лише дизайн чи ще й розробку?',
      'faq.a4': 'Ми беремо на себе все: від UX/UI дизайну у Figma до розробки й запуску. Ви отримуєте готовий до використання сайт із власним доменом — без жодного технічного клопоту з вашого боку.',
      'faq.q5': 'Як ми будемо спілкуватися під час роботи?',
      'faq.a5': 'Ми спілкуємось через WhatsApp,Telegram, email, instagram — там, де вам зручніше. Ви бачитимете прогрес на кожному етапі й можете ставити запитання в будь-який час.',
      'faq.q6': 'Чому варто обрати вас, а не дешевого фрилансера чи ШІ?',
      'faq.a6': 'Ми не просто робимо сайти красивими — ми продумуємо логіку, структуру та шлях користувача, щоб ваш сайт справді перетворював відвідувачів на покупців. Ви отримуєте унікальний дизайн, швидкий зв’язок і команду, яка ставиться до вашого бізнесу як до свого.',
      'faq.q7': 'Що потрібно від мене, щоб почати?',
      'faq.a7': 'Просто розкажіть нам про свій бізнес — чим ви займаєтесь, хто ваші клієнти і чого ви хочете досягти за допомогою сайту. Щоб почати, підготуйте назву бізнесу, логотип і фото, які хочете бачити на сайті. Все інше ми зробимо самі й проведемо вас через кожен крок.',
      'quote.text': '<span class="gradient-text">Найбільша</span> Найбільша проблема більшості сайтів — не в тому, як вони виглядають, а в <span class="muted">логіці, зручності використання, адаптивному досвіді та розумінні</span> того, для кого вони насправді створені',
      'quote.note': 'Саме це ми вирішуємо в кожному проєкті — щоб ваші потенційні клієнти відчували себе комфортно, користуючись сайтом з першої ж секунди.',
      'quote.role': 'UX/UI дизайнер',
      'marquee.hand': 'Створено вручну, а не за промптом',
      'marquee.calls': 'Перетворює відвідувачів на дзвінки',
      'marquee.looks': 'Виглядає як ви, а не як усі',
      'marquee.launch': 'Запуск за тижні, а не місяці',
      'cta.heading': 'Чим довше ви чекаєте,<br> то більше <span class="dim">грошей</span><br> втрачає ваш <span class="dim">бізнес</span>',
      'cta.talk': 'Поговорімо',
      'footer.privacy': 'Політика конфіденційності',
      'modal.heading': 'Зв’язатися з нами',
      'modal.subtitle': 'Ми напишемо вам протягом 24 годин.',
      'modal.close.aria': 'Закрити',
      'form.name': 'Як вас звати?',
      'form.email': 'Ваш email',
      'form.message': 'Повідомлення (необов’язково)',
      'form.confirm': 'Підтвердити',
      'contact.sending': 'Надсилання…',
      'contact.successMsg': 'Дякуємо! Ми зв’яжемось з вами протягом 24 годин.',
      'contact.genericError': 'Щось пішло не так — спробуйте ще раз або напишіть нам напряму.',
      'contact.networkError': 'Помилка мережі — перевірте з’єднання і спробуйте ще раз.',
      'email.copied': 'Скопійовано ✓',
      'privacy.metaTitle': 'Політика конфіденційності — Aonix Studio',
      'privacy.metaDescription': 'Як Aonix Studio збирає, використовує та захищає вашу інформацію.',
      'privacy.h1': 'Політика конфіденційності',
      'privacy.updated': 'Востаннє оновлено: серпень 2026',
      'privacy.backTop': '← На головну',
      'privacy.backBottom': '← На головну',
      'privacy.s1.title': 'Хто ми',
      'privacy.s1.p1': 'Aonix Studio — студія дизайну та розробки. Михайло Ворона відповідає за UX/UI дизайн, а Джейкоб Сіхул займається full-stack розробкою. Ми створюємо індивідуальні сайти для малого бізнесу. Ми працюємо віддалено з України та Кенії, а це означає, що ваші дані можуть оброблятися за межами Європейської економічної зони. Незалежно від цього, ми ставимось до них з однаковою відповідальністю — у розділах нижче ви знайдете, що саме ми збираємо і як довго це зберігаємо.',
      'privacy.s1.p2': 'Ця політика пояснює, що відбувається з вашою інформацією, коли ви звертаєтесь до нас через цей сайт. Якщо у вас виникнуть запитання, пишіть нам на hello@aonixstudio.com.',
      'privacy.s2.title': 'Яку інформацію ми збираємо',
      'privacy.s2.p1': 'Ми збираємо лише те, що ви самі вирішуєте нам надіслати. Коли ви заповнюєте контактну форму на цьому сайті, ми отримуємо ваше ім’я, електронну адресу та повідомлення, яке ви написали.',
      'privacy.s2.p2': 'Ми не використовуємо аналітику, рекламні трекери чи cookies, які стежать за вами в інтернеті. Ми не збираємо вашу IP-адресу, історію переглядів чи будь-яку іншу інформацію, яку ви не надали нам свідомо.',
      'privacy.s3.title': 'Як ми використовуємо вашу інформацію',
      'privacy.s3.p1': 'Ми використовуємо ваші дані лише з однією метою: щоб відповісти вам і обговорити можливий проєкт. Більше нічого.',
      'privacy.s3.p2': 'Ми не продаємо ваші дані, не передаємо їх рекламодавцям і не додаємо вас до розсилок. Якщо ви звернулись до нас, а ми так і не почали співпрацю, ваша інформація просто залишається невикористаною, доки не буде видалена.',
      'privacy.s4.title': 'Де зберігаються ваші дані',
      'privacy.s4.p1': 'Заповнені контактні форми обробляються сервісом Formspree — стороннім сервісом форм, і надходять на нашу поштову скриньку, розміщену на Zoho Mail. Обидва провайдери зберігають дані на власних серверах і мають власні політики конфіденційності, які варто прочитати, якщо вам потрібна повна технічна картина.',
      'privacy.s4.p2': 'Сам сайт розміщено на хостингу Vercel. Домен зареєстровано через Namecheap.',
      'privacy.s5.title': 'Як довго ми це зберігаємо',
      'privacy.s5.p1': 'Ми зберігаємо ваше повідомлення, поки триває наше спілкування, а також протягом розумного періоду після цього — на випадок, якщо ви знову звернетесь.',
      'privacy.s5.p2': 'Якщо ми не почали співпрацю і немає причин зберігати ваші дані, ми їх видаляємо. Ви також можете попросити нас видалити їх у будь-який момент — і ми це зробимо.',
      'privacy.s6.title': 'Ваші права',
      'privacy.s6.p1': 'Якщо ви перебуваєте в Європейському Союзі або Великій Британії, GDPR надає вам право на доступ до персональних даних, які ми про вас зберігаємо, на їх виправлення, якщо вони некоректні, на видалення, а також право заперечувати проти того, як ми їх використовуємо.',
      'privacy.s6.p2': 'Вам не потрібно заповнювати жодних форм чи проходити якийсь процес. Просто напишіть на hello@aonixstudio.com і скажіть, що потрібно зробити. Ми все виконаємо і підтвердимо, коли це буде готово.',
      'privacy.s7.title': 'Контакти',
      'privacy.s7.p1': 'З будь-яких питань щодо цієї політики або ваших даних пишіть на hello@aonixstudio.com.',
      'privacy.s7.p2': 'Ми можемо оновлювати цю політику, якщо змінюємо принцип роботи сайту — наприклад, якщо в майбутньому додамо аналітику. Коли це станеться, ми оновимо дату «востаннє оновлено» у верхній частині цієї сторінки.',
    },
  };

  const listeners = [];
  let current = localStorage.getItem(STORAGE_KEY) === 'uk' ? 'uk' : 'en';

  function t(key) {
    const dict = STRINGS[current];
    return dict && dict[key] !== undefined ? dict[key] : STRINGS.en[key];
  }

  function applyToDom() {
    document.documentElement.lang = current === 'uk' ? 'uk' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = t(el.getAttribute('data-i18n'));
      if (value === undefined) return;
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
      else el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
        const [attr, key] = pair.split(':');
        if (!attr || !key) return;
        const value = t(key);
        if (value !== undefined) el.setAttribute(attr, value);
      });
    });

    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = current === 'uk' ? 'EN' : 'UA';
      toggle.setAttribute(
        'aria-label',
        current === 'uk' ? 'Switch to English' : 'Переключити на українську'
      );
    }
  }

  function setLang(lang) {
    current = lang === 'uk' ? 'uk' : 'en';
    localStorage.setItem(STORAGE_KEY, current);
    applyToDom();
    listeners.forEach((fn) => fn(current));
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  applyToDom();

  return {
    t,
    setLang,
    onChange,
    get lang() {
      return current;
    },
  };
})();

// Language toggle button (dock-side-right, before the Telegram/
// WhatsApp icons): flips between the two languages set up above.
(function () {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    AonixI18N.setLang(AonixI18N.lang === 'uk' ? 'en' : 'uk');
  });
})();

// Preloader: cycles a "Welcome" greeting through a few languages,
// then the whole overlay slides up off-screen. Runs once per real
// page load (a plain top-level script, never re-invoked by in-page
// #anchor navigation) — nothing to gate that on.
//
// It should still only *play* once per browser tab, though: an
// explicit reload (F5 / the reload button) always replays it, but a
// tab that's just regaining focus, or a fresh navigation into a tab
// that already saw it this session, should not. Switching Chrome
// tabs doesn't reload the page at all — the script never re-runs, so
// there's nothing to special-case for that.
(function () {
  const preloader = document.getElementById('preloader');
  const wordEl = document.getElementById('preloader-word');
  if (!preloader || !wordEl) return;

  const navEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navEntry && navEntry.type === 'reload';
  const alreadyShown = sessionStorage.getItem('preloaderShown') === 'true';

  if (!isReload && alreadyShown) {
    // Not a manual reload, and this tab already saw the greeting —
    // skip straight to content: no animation, no scroll lock.
    preloader.classList.add('is-done');
    return;
  }

  sessionStorage.setItem('preloaderShown', 'true');

  const WORDS = ['Welcome', 'Bienvenido', 'Bienvenue', 'Вітаю', 'Witamy', 'Vitajte'];
  const TOTAL_DURATION = 2000;
  const STEP_DURATION = TOTAL_DURATION / WORDS.length;

  document.body.classList.add('preloader-active');

  function finish() {
    document.body.classList.remove('preloader-active');
    preloader.classList.add('is-hiding');
    preloader.addEventListener(
      'transitionend',
      () => preloader.classList.add('is-done'),
      { once: true }
    );
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    wordEl.textContent = WORDS[0];
    setTimeout(() => {
      document.body.classList.remove('preloader-active');
      preloader.classList.add('is-done');
    }, 500);
    return;
  }

  let index = 0;
  wordEl.textContent = WORDS[index];
  const cycle = setInterval(() => {
    index += 1;
    if (index >= WORDS.length) {
      clearInterval(cycle);
      finish();
      return;
    }
    wordEl.textContent = WORDS[index];
  }, STEP_DURATION);
})();

// Scroll effect: reveal [data-fill-text] word by word, in reading
// order, as the .statement section's sticky inner (.stack-pin) is
// pinned. Each word flips straight from #e5e5e5 to #0a0a0a (see
// .statement-text .word / .is-filled in css/style.css) — no fade.
// rAF-throttled so fast scrolling stays smooth.
(function () {
  const section = document.querySelector('.statement');
  const textEl = document.querySelector('[data-fill-text]');
  if (!section || !textEl) return;

  let words = [];
  let filledCount = -1;
  let ticking = false;

  function splitIntoWords() {
    const list = textEl.textContent.trim().replace(/\s+/g, ' ').split(' ');
    textEl.innerHTML = list
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');
    return Array.from(textEl.querySelectorAll('.word'));
  }

  function updateFill() {
    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable > 0
      ? Math.min(1, Math.max(0, -rect.top / scrollable))
      : 0;

    const activeCount = Math.round(progress * words.length);
    if (activeCount !== filledCount) {
      words.forEach((word, i) => {
        word.classList.toggle('is-filled', i < activeCount);
      });
      filledCount = activeCount;
    }
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFill);
  }

  // Re-split into word spans whenever [data-i18n] has just replaced
  // textEl's textContent with a translated string (see AonixI18N
  // above) — otherwise the old English <span class="word"> markup
  // would keep showing through the new language's raw text.
  function refresh() {
    words = splitIntoWords();
    filledCount = -1;
    updateFill();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  refresh();
  AonixI18N.onChange(refresh);
})();

// Dock nav CTA color swap: while the fixed dock nav overlaps the
// .cta-through-footer stretch of .finale (marquee excluded), add
// .on-dark (see css/style.css) to turn the gradient "Contact us"
// button into a plain white pill; everywhere else it stays the
// default gradient. The same overlap also drives body.dock-on-dark,
// which hides the .dock-side email/socials (see css/style.css) once
// the footer below is showing that same contact info anyway.
(function () {
  const dockNav = document.querySelector('.dock-nav');
  const ctaSection = document.querySelector('.cta');
  const finaleSection = document.querySelector('.finale');
  if (!dockNav || !ctaSection || !finaleSection) return;

  let ticking = false;

  function updateDockCta() {
    const dockRect = dockNav.getBoundingClientRect();
    // Dark zone runs from the top of .cta to the very bottom of
    // .finale (footer + its trailing dock-clearance buffer are black
    // too), but starts after the marquee band on purpose.
    const zoneTop = ctaSection.getBoundingClientRect().top;
    const zoneBottom = finaleSection.getBoundingClientRect().bottom;
    const overlaps = dockRect.bottom > zoneTop && dockRect.top < zoneBottom;
    dockNav.classList.toggle('on-dark', overlaps);
    document.body.classList.toggle('dock-on-dark', overlaps);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateDockCta);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateDockCta();
})();

// FAQ accordion: native <details> toggling has no transition hook (it
// jumps straight to display:none), so we intercept the click, drive
// open/close through a height animation via the Web Animations API,
// and replicate the exclusive "only one open at a time" behavior the
// markup's name="faq" grouping used to give us for free. The .is-open
// class (see .faq-item.is-open .chevron in css/style.css) tracks the
// user's intent immediately so the chevron flips right away instead
// of waiting on the slower height animation.
(function () {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  const DURATION = 300;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  // Per item: the in-flight animation plus a request token. Rapid
  // clicking can fire a stale animation's "finish" event *after* a
  // newer one has already taken over the same element/property (a
  // real WAAPI/compositor race, reproducible by opening/closing the
  // same item several times in under ~300ms) — that stale finish used
  // to still run its onDone (e.g. setting item.open = false right
  // after a newer click had reopened it), which is the reported lag/
  // glitch. Stamping every animateTo() call with an incrementing token
  // and having onfinish bail out unless its token is still the latest
  // makes any late/duplicate callback a harmless no-op.
  const state = new WeakMap();

  function animateTo(item, targetHeight, onDone) {
    const entry = state.get(item);
    const token = (entry ? entry.token : 0) + 1;
    const startHeight = item.getBoundingClientRect().height;
    if (entry) entry.animation.cancel();

    item.style.overflow = 'hidden';
    const animation = item.animate(
      { height: [`${startHeight}px`, `${targetHeight}px`] },
      { duration: DURATION, easing: EASING }
    );
    state.set(item, { animation, token });

    animation.onfinish = () => {
      if (state.get(item)?.token !== token) return; // superseded — ignore
      item.style.height = '';
      item.style.overflow = '';
      if (onDone) onDone();
    };
  }

  function expand(item) {
    item.open = true;
    animateTo(item, item.scrollHeight);
  }

  function collapse(item) {
    const summaryHeight = item.querySelector('summary').offsetHeight;
    animateTo(item, summaryHeight, () => { item.open = false; });
  }

  // Bound to the whole item, not just the summary: once a question is
  // open, the box can grow well past the summary's thin header strip,
  // so closing it required hunting back up for that strip — clicking
  // anywhere on an already-open item now closes it too. A closed item
  // still only reacts to its summary (nothing else is visible yet
  // anyway), and a text-selection drag inside the answer is left
  // alone instead of being swallowed as a close click.
  items.forEach((item) => {
    const summary = item.querySelector('summary');

    item.addEventListener('click', (e) => {
      const onSummary = e.target.closest('summary') === summary;
      const isOpen = item.classList.contains('is-open');

      if (!onSummary && !isOpen) return;
      if (!onSummary && window.getSelection().toString()) return;

      e.preventDefault();

      if (isOpen) {
        item.classList.remove('is-open');
        collapse(item);
        return;
      }

      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          collapse(other);
        }
      });

      item.classList.add('is-open');
      expand(item);
    });
  });
})();

// Project thumb custom cursor: the .project-cursor badge (see
// css/style.css) follows the pointer via the --cursor-x/--cursor-y
// custom properties instead of sitting fixed in the center; CSS alone
// handles the fade/scale on hover.
(function () {
  const thumbs = document.querySelectorAll('.project-thumb');
  if (!thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('mousemove', (e) => {
      const rect = thumb.getBoundingClientRect();
      thumb.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
      thumb.style.setProperty('--cursor-y', `${e.clientY - rect.top}px`);
    });
  });
})();

// Reveal-on-scroll: adds .is-visible (see .reveal in css/style.css)
// to each .reveal element the first time it enters the viewport, then
// stops watching it — a one-shot fade/slide-in, not a repeating
// scroll effect.
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

// Contact modal: opened by every [data-open-contact] trigger (the
// dock nav's "Contact us" and the CTA section's "Let's talk"),
// closed via [data-close-contact] (backdrop + X button) or Escape.
// The form posts to Formspree (see form's action= in index.html) —
// that's also the no-JS fallback, a plain POST that redirects to
// Formspree's own thank-you page. With JS, the submit below
// intercepts it and does the same POST via fetch instead, so the
// result shows inline in the modal without leaving the page.
(function () {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-open-contact]');
  const closeTriggers = modal.querySelectorAll('[data-close-contact]');
  const form = modal.querySelector('.contact-form');
  let lastFocused = null;

  function openModal(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // The backdrop's blur has to be recomputed every frame anything
    // behind it changes — with the gradient sweeps, the marquee
    // scroll and the hero badges' own blur(40px) glass all still
    // running, that was the actual source of the jank (measured:
    // ~55ms/frame while open vs ~18ms with these paused). Freezing
    // them while the modal is up removes that ongoing repaint cost;
    // .paused (see css/style.css) resumes them on close.
    document.body.classList.add('modal-open');
    const firstInput = modal.querySelector('.contact-input');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  openTriggers.forEach((trigger) => trigger.addEventListener('click', openModal));
  closeTriggers.forEach((trigger) => trigger.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  if (form) {
    const submitBtn = form.querySelector('.contact-submit');
    const statusEl = form.querySelector('[data-form-status]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.classList.remove('contact-form-status--success', 'contact-form-status--error');
      submitBtn.disabled = true;
      submitBtn.textContent = AonixI18N.t('contact.sending');

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          statusEl.textContent = AonixI18N.t('contact.successMsg');
          statusEl.classList.add('contact-form-status--success');
          form.reset();
          setTimeout(closeModal, 2000);
        } else {
          const data = await response.json().catch(() => null);
          const message = data && data.errors
            ? data.errors.map((err) => err.message).join(', ')
            : AonixI18N.t('contact.genericError');
          statusEl.textContent = message;
          statusEl.classList.add('contact-form-status--error');
        }
      } catch (err) {
        statusEl.textContent = AonixI18N.t('contact.networkError');
        statusEl.classList.add('contact-form-status--error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = AonixI18N.t('form.confirm');
      }
    });
  }
})();

// Mobile nav: the hamburger (phone-width only — see .dock-burger in
// css/style.css) toggles .mobile-nav, the stand-in for .dock-links at
// that width. Closes on a link click, an outside click, or Escape.
(function () {
  const burger = document.getElementById('dock-burger');
  const nav = document.getElementById('mobile-nav');
  if (!burger || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    nav.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || burger.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });
})();

// Email links (header + footer): on desktop, clicking mailto: often
// does nothing visible — plenty of desktop browsers have no mail
// client registered as the OS default, so the click silently goes
// nowhere and it just looks broken. Mobile always has one, so it's
// left untouched there. Desktop gets a copy-to-clipboard + "Copied"
// text swap alongside the normal mailto: hand-off (no preventDefault
// — if the user *does* have a mail client, it still opens as usual).
(function () {
  const emailLinks = document.querySelectorAll('.dock-side-left, .footer-email');
  if (!emailLinks.length || !navigator.clipboard) return;

  const isDesktop = () => window.matchMedia('(min-width: 761px)').matches;

  emailLinks.forEach((link) => {
    const originalText = link.textContent;
    let resetTimer = null;

    link.addEventListener('click', () => {
      if (!isDesktop()) return;

      const email = link.href.replace(/^mailto:/, '').split('?')[0];
      navigator.clipboard.writeText(email).then(() => {
        clearTimeout(resetTimer);
        link.textContent = AonixI18N.t('email.copied');
        resetTimer = setTimeout(() => {
          link.textContent = originalText;
        }, 2000);
      }).catch(() => {});
    });
  });
})();
