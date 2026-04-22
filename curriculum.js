const CURRICULUM = [
  // ── MODULE 1 ─────────────────────────────────────────────────────────────
  {
    id: "platform-overview",
    title: "Platform Overview",
    icon: "🌐",
    color: "#0070d2",
    type: "both",
    description: "Architecture, sandboxes, Business Manager, and the two B2C vs B2B models.",
    lessons: [
      {
        id: "sfcc-architecture",
        title: "SFCC Architecture",
        duration: "7 min",
        type: "both",
        concept: [
          { type: "p", text: "Salesforce Commerce Cloud (SFCC) is a cloud-based SaaS e-commerce platform originally known as Demandware. It consists of two distinct products: <code>B2C Commerce</code> (formerly Demandware) and <code>B2B Commerce</code> (formerly CloudCraze, built natively on Salesforce Core)." },
          { type: "heading", text: "B2C Commerce" },
          { type: "p", text: "B2C Commerce is a multi-tenant SaaS platform hosted on Salesforce's infrastructure. Merchants share underlying compute and storage but data is strictly isolated. It uses a proprietary server-side scripting environment called <code>SSJS</code> (Server-Side JavaScript) running on Rhino, plus <code>ISML</code> templates for HTML rendering." },
          { type: "callout", callout: "info", title: "Key Fact", text: "B2C Commerce does NOT run standard Node.js. It runs Mozilla Rhino — an older JavaScript engine. ES6+ features are limited; use SFCC Script API instead of standard browser/Node APIs." },
          { type: "heading", text: "B2B Commerce" },
          { type: "p", text: "B2B Commerce runs as a managed package on the Salesforce Platform (Force.com). This means it leverages Apex, Visualforce/LWC, SOQL, and standard Salesforce objects (Accounts, Contacts, Opportunities). It is deeply integrated with Sales Cloud and Service Cloud out of the box." },
          { type: "callout", callout: "tip", title: "Key Difference", text: "B2C = custom storefront stack (cartridges, ISML, SSJS). B2B = Salesforce platform stack (LWC, Apex, SOQL). Skills transfer in concept but not in implementation." },
          { type: "p", text: "Both products share Commerce Cloud Storefront as a shared digital experience layer and Salesforce Order Management (OMS) for post-purchase flows. Einstein AI features (recommendations, search) are available in both." },
        ],
        code: [
          {
            title: "B2C Request Lifecycle (simplified)",
            lang: "text",
            code: `Browser Request
    ↓
CDN (Fastly) — edge cache check
    ↓ (cache miss)
SFCC Web Adapter (load balancer)
    ↓
Pipeline / Controller lookup (cartridge path)
    ↓
SSJS Controller executes (server.get / server.post)
    ↓
Model fetches data via SFCC Script API
    ↓
ISML Template renders HTML
    ↓
Response → CDN cached → Browser`,
            explanation: "Every storefront request goes through this chain. Controllers replace older Pipelines in SFRA."
          },
          {
            title: "B2B Commerce Request Lifecycle",
            lang: "text",
            code: `Browser (LWC storefront or custom)
    ↓
Experience Cloud / Digital Experiences
    ↓
Commerce APIs (ConnectApi or REST)
    ↓
B2B Commerce Managed Package (Apex)
    ↓
Salesforce Platform (Force.com)
    ↓
Standard objects: Account, Order, Product2, Pricebook2`,
            explanation: "B2B runs on Force.com — standard Salesforce security model, governor limits, and deployment tools apply."
          }
        ],
        quiz: [
          {
            q: "What JavaScript engine does B2C Commerce use for server-side scripting?",
            options: ["Node.js v18", "Mozilla Rhino (Rhino JS)", "V8 (Chrome)", "Deno"],
            correct: 1,
            explanation: "B2C Commerce uses Mozilla Rhino, an older JVM-based JavaScript engine. This means ES6+ features like arrow functions and template literals are partially or fully unavailable."
          },
          {
            q: "B2B Commerce is built on top of which platform?",
            options: ["Custom cloud infrastructure", "AWS Lambda", "Salesforce Core (Force.com)", "Heroku"],
            correct: 2,
            explanation: "B2B Commerce is a managed package on the Salesforce Platform (Force.com), leveraging Apex, SOQL, LWC, and standard Salesforce objects."
          },
          {
            q: "Which CDN does B2C Commerce use for edge caching?",
            options: ["Cloudflare", "Akamai", "Fastly", "AWS CloudFront"],
            correct: 2,
            explanation: "B2C Commerce uses Fastly as its CDN provider for edge caching and performance."
          },
          {
            q: "True or False: B2C Commerce and B2B Commerce share the same codebase and development approach.",
            options: ["True", "False"],
            correct: 1,
            explanation: "False. B2C uses cartridges, ISML, and SSJS. B2B uses Apex, LWC, and Salesforce platform patterns. They are architecturally different products."
          }
        ]
      },
      {
        id: "sandboxes-bm",
        title: "Sandboxes & Business Manager",
        duration: "6 min",
        type: "b2c",
        concept: [
          { type: "p", text: "Every SFCC B2C project uses <code>sandboxes</code> — dedicated cloud instances for development and testing. Sandboxes are isolated environments provisioned via Salesforce Commerce Cloud Control Center (Account Manager)." },
          { type: "heading", text: "Sandbox Types" },
          { type: "p", text: "<strong>Development sandboxes</strong> are used by individual developers. They have a subset of production data and can be reset. <strong>Staging</strong> instances are used for integration testing and UAT, and are typically kept in sync with production data via replication jobs." },
          { type: "heading", text: "Business Manager" },
          { type: "p", text: "Business Manager (BM) is the SFCC merchant administration tool, accessible at <code>https://&lt;your-sandbox&gt;.demandware.net/on/demandware.store/Sites-Site</code>. It is the control panel for catalogs, pricing, promotions, content, jobs, and site configuration." },
          { type: "callout", callout: "warning", title: "Important", text: "Business Manager uses its own role-based permission system separate from Salesforce Core. Users must be provisioned in Account Manager AND granted roles in BM separately." },
          { type: "p", text: "Key BM areas: <strong>Merchant Tools</strong> (products, promotions, content, customers), <strong>Administration</strong> (site settings, jobs, cartridge path, custom preferences), and <strong>Staging</strong> (data replication to production)." },
        ],
        code: [
          {
            title: "dwre.json — local SFCC project config",
            lang: "json",
            code: `{
  "hostname": "dev01-na01-mycompany.demandware.net",
  "username": "developer@mycompany.com",
  "password": "sandbox-password",
  "code-version": "version1",
  "cartridge": [
    "app_custom_mycompany",
    "app_storefront_base",
    "modules"
  ]
}`,
            explanation: "dwre.json (or dw.json) configures the SFCC development toolchain. The cartridge path here controls override resolution order."
          },
          {
            title: "Upload code via SFCC Dev Tools (CLI)",
            lang: "bash",
            code: `# Install SFCC dev tools
npm install -g sfcc-ci

# Upload a cartridge to sandbox
sfcc-ci code:deploy --cartridge ./cartridges/app_custom_mycompany \\
  --instance dev01-na01-mycompany.demandware.net \\
  --version version1

# Activate the code version
sfcc-ci code:activate --version version1 \\
  --instance dev01-na01-mycompany.demandware.net`,
            explanation: "sfcc-ci is the official CLI for SFCC. It handles code upload, job execution, and data import/export."
          }
        ],
        quiz: [
          {
            q: "Where do you configure the cartridge path for a B2C site?",
            options: ["In the package.json file", "In Business Manager under Administration > Sites > Manage Sites", "In the dwre.json file only", "In the SFCC Control Center"],
            correct: 1,
            explanation: "The cartridge path is configured in Business Manager under Administration > Sites > Manage Sites > [your site] > Settings tab."
          },
          {
            q: "What is the purpose of a staging instance in SFCC B2C?",
            options: ["It replaces the production instance", "Used for integration testing/UAT with production-like data before pushing to prod", "It is a developer sandbox", "It is only used for email campaigns"],
            correct: 1,
            explanation: "Staging is used for UAT and integration testing. Data replication from production keeps it in sync, and code deployments are tested here before production activation."
          },
          {
            q: "Business Manager user roles are managed in which tool?",
            options: ["Salesforce Setup (Lightning)", "Business Manager AND Account Manager (both required)", "Only Account Manager", "Only Business Manager"],
            correct: 1,
            explanation: "Users need to be provisioned in Account Manager (gives them access to the sandbox) AND granted specific BM roles in Business Manager itself."
          }
        ]
      }
    ]
  },

  // ── MODULE 2 ─────────────────────────────────────────────────────────────
  {
    id: "cartridge-system",
    title: "Cartridge System",
    icon: "📦",
    color: "#5c7cfa",
    type: "b2c",
    description: "How cartridges, the cartridge path, controllers, and ISML templates work together.",
    lessons: [
      {
        id: "cartridge-basics",
        title: "Cartridge Basics & Path",
        duration: "8 min",
        type: "b2c",
        concept: [
          { type: "p", text: "A <strong>cartridge</strong> is the fundamental unit of code in SFCC B2C Commerce. Think of it as a plugin or module — it contains controllers, models, templates, scripts, and static assets. Cartridges are isolated by convention; they don't directly call each other's code but override each other via the cartridge path." },
          { type: "heading", text: "The Cartridge Path" },
          { type: "p", text: "The cartridge path is an ordered list of cartridge names (e.g., <code>app_custom:app_sfra_tweaks:app_storefront_base:modules</code>). When SFCC resolves a controller or template, it searches cartridges from left to right and uses the first match found." },
          { type: "callout", callout: "warning", title: "Common Mistake", text: "Always place your customisation cartridge to the LEFT of app_storefront_base in the path. Placing it to the right means it will never be found — the base cartridge will match first." },
          { type: "heading", text: "Cartridge Directory Structure" },
          { type: "p", text: "Each cartridge follows a strict folder convention. The <code>cartridge/</code> subfolder is the actual package contents uploaded to SFCC. <code>controllers/</code>, <code>templates/</code>, <code>scripts/</code>, <code>models/</code>, and <code>static/</code> are the standard subdirectories." },
          { type: "callout", callout: "tip", title: "Best Practice", text: "Never modify app_storefront_base directly. Create a new cartridge (e.g., app_custom_brand) that overrides only the files you need to change. This makes upgrades far easier." },
        ],
        code: [
          {
            title: "Cartridge folder structure",
            lang: "text",
            code: `app_custom_brand/               ← your cartridge root
├── cartridge/
│   ├── controllers/
│   │   └── Product.js          ← overrides base Product controller
│   ├── templates/
│   │   └── default/
│   │       └── product/
│   │           └── productDetails.isml
│   ├── scripts/
│   │   └── helpers/
│   │       └── productHelper.js
│   ├── models/
│   │   └── ProductModel.js
│   └── static/
│       ├── default/
│       │   ├── css/
│       │   └── js/
│       └── en_US/
├── package.json                ← "main": "cartridge/controllers/index.js"
└── .project`,
            explanation: "The cartridge/ subdirectory is what gets uploaded to SFCC. Static assets are served from the static/ subfolder."
          },
          {
            title: "package.json for a cartridge",
            lang: "json",
            code: `{
  "name": "app_custom_brand",
  "version": "1.0.0",
  "main": "cartridge/controllers/index.js",
  "cartridge": {
    "name": "app_custom_brand",
    "dependencies": ["app_storefront_base"]
  }
}`,
            explanation: "The 'main' entry and cartridge name must match the folder name exactly. SFCC uses this to register the cartridge."
          }
        ],
        quiz: [
          {
            q: "Given cartridge path 'app_custom:app_base', and both cartridges have Product.js — which one runs?",
            options: ["app_base, because it's the base", "app_custom, because it's leftmost in the path", "Both run in sequence", "The alphabetically first one"],
            correct: 1,
            explanation: "SFCC evaluates the cartridge path left to right and uses the first match. app_custom is leftmost, so its Product.js takes precedence."
          },
          {
            q: "Which directory inside a cartridge holds server-side JavaScript controllers?",
            options: ["cartridge/scripts/", "cartridge/server/", "cartridge/controllers/", "cartridge/routes/"],
            correct: 2,
            explanation: "Controllers live in cartridge/controllers/. Scripts (helper functions, models) live in cartridge/scripts/."
          },
          {
            q: "True or False: You should directly edit app_storefront_base to add your customisations.",
            options: ["True", "False"],
            correct: 1,
            explanation: "False. You should create a custom cartridge that overrides only the files you need. Direct edits to app_storefront_base will be lost during SFRA upgrades."
          },
          {
            q: "Where in Business Manager do you set the cartridge path?",
            options: ["Merchant Tools > Site Preferences", "Administration > Sites > Manage Sites > [site] > Settings", "Staging > Code Deployment", "Administration > Global Preferences"],
            correct: 1,
            explanation: "The cartridge path for a site is set in Administration > Sites > Manage Sites > [site name] > Settings tab > Cartridges field."
          }
        ]
      },
      {
        id: "controllers",
        title: "SFRA Controllers",
        duration: "10 min",
        type: "b2c",
        concept: [
          { type: "p", text: "Controllers are the routing layer in SFRA (Storefront Reference Architecture). They handle HTTP requests, call models/services, and pass data to ISML templates for rendering. Each file in <code>cartridge/controllers/</code> maps to a URL segment." },
          { type: "p", text: "Controllers use the <code>server</code> module from <code>*/cartridge/scripts/server</code>. Supported HTTP methods are <code>server.get()</code>, <code>server.post()</code>, and <code>server.use()</code> (handles both). Each method registers a route handler with middleware support." },
          { type: "heading", text: "Extending vs Replacing" },
          { type: "p", text: "SFRA provides two extension patterns: <code>server.extend()</code> + <code>server.append()</code> lets you add logic after the base route runs. <code>server.replace()</code> completely replaces the route. Use append when possible — it makes upgrades easier." },
          { type: "callout", callout: "info", title: "URL Pattern", text: "Controller file: Product.js, method: server.get('Show', ...) → URL: /Product-Show. The pattern is always [ControllerFile]-[RouteName]." },
          { type: "callout", callout: "warning", title: "Always call next()", text: "Every middleware function MUST call next() or next(new Error()) to continue the chain. Forgetting next() silently hangs the request." },
        ],
        code: [
          {
            title: "Basic SFRA Controller (Product.js)",
            lang: "javascript",
            code: `'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

// GET /Product-Show?pid=123
server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var ProductFactory = require('*/cartridge/scripts/factories/product');

    var product = ProductMgr.getProduct(req.querystring.pid);

    if (!product || !product.online) {
        res.setStatusCode(404);
        res.render('error/notFound');
        return next();
    }

    var productHelper = ProductFactory.get({ pid: req.querystring.pid });

    res.render('product/productDetails', {
        product: productHelper,
        breadcrumbs: []
    });

    return next();
});

module.exports = server.exports();`,
            explanation: "server.get() registers a GET handler. req.querystring accesses URL params. res.render() passes data to an ISML template."
          },
          {
            title: "Extending the base controller (custom cartridge)",
            lang: "javascript",
            code: `'use strict';

// In app_custom_brand/cartridge/controllers/Product.js
var server = require('server');
// Load the BASE Product controller from app_storefront_base
server.extend(module.superModule);

// Append custom logic after the base Show route runs
server.append('Show', function (req, res, next) {
    // res.getViewData() gets data set by previous middleware
    var viewData = res.getViewData();

    // Add custom field to template data
    viewData.customBadge = 'NEW ARRIVAL';
    viewData.loyaltyPoints = calculatePoints(viewData.product.price.sales.value);

    res.setViewData(viewData);
    return next();
});

function calculatePoints(price) {
    return Math.floor(price * 10);
}

module.exports = server.exports();`,
            explanation: "server.extend(module.superModule) loads the parent cartridge's controller. server.append() runs your code AFTER the base route, avoiding full replacement."
          },
          {
            title: "Accessing request data",
            lang: "javascript",
            code: `server.post('AddToCart', function (req, res, next) {
    // Query string: req.querystring.pid
    // POST body (form): req.form.quantity
    // Session data: req.session.privacyCache.get('key')
    // Cookies: req.httpMethod (read only; set via res)
    // Locale: req.locale.id  → 'en_US'
    // Currency: req.session.currency.currencyCode  → 'USD'

    var pid = req.querystring.pid;
    var quantity = parseInt(req.form.quantity, 10) || 1;

    // JSON response (AJAX endpoints)
    res.json({
        success: true,
        pid: pid,
        quantity: quantity
    });

    return next();
});`,
            explanation: "SFRA separates query string (req.querystring) from POST body (req.form). Use res.json() for AJAX endpoints instead of res.render()."
          }
        ],
        quiz: [
          {
            q: "What URL does the route server.get('Confirm', ...) in CheckoutController.js produce?",
            options: ["/CheckoutController/Confirm", "/Checkout-Confirm", "/checkout/confirm", "/Confirm-Checkout"],
            correct: 1,
            explanation: "The URL pattern is [FileName]-[RouteName]. CheckoutController.js → Checkout, route name 'Confirm' → /Checkout-Confirm."
          },
          {
            q: "What does server.append() do vs server.replace()?",
            options: [
              "append() adds to the end of the file; replace() rewrites the file",
              "append() runs your code AFTER the base route; replace() completely replaces it",
              "append() adds a new route; replace() updates an existing one",
              "They are identical"
            ],
            correct: 1,
            explanation: "server.append() executes your middleware after all existing middleware in the route chain. server.replace() discards all existing middleware and substitutes yours."
          },
          {
            q: "What happens if you forget to call next() in a middleware function?",
            options: ["The next middleware runs automatically", "An error is thrown immediately", "The request silently hangs / never completes", "The controller skips to the template"],
            correct: 2,
            explanation: "Forgetting next() silently hangs the request. No error is thrown — the chain just stops. Always call next() or next(new Error('msg'))."
          },
          {
            q: "How do you access a URL query parameter (e.g. ?pid=123) in an SFRA controller?",
            options: ["req.params.pid", "req.querystring.pid", "req.query.pid", "req.url.params.pid"],
            correct: 1,
            explanation: "SFRA uses req.querystring (not req.query like Express). req.form is for POST body parameters."
          }
        ]
      },
      {
        id: "isml-templates",
        title: "ISML Templates",
        duration: "9 min",
        type: "b2c",
        concept: [
          { type: "p", text: "ISML (Internet Store Markup Language) is SFCC's server-side templating language. It is XML/HTML mixed with custom <code>&lt;is*&gt;</code> tags that execute on the server before sending the response. ISML files live in <code>cartridge/templates/default/</code>." },
          { type: "heading", text: "Core ISML Tags" },
          { type: "p", text: "<code>&lt;isprint&gt;</code> outputs a variable with optional encoding. <code>&lt;isif&gt;</code> / <code>&lt;iselse&gt;</code> / <code>&lt;iselseif&gt;</code> handle conditionals. <code>&lt;isloop&gt;</code> iterates over collections. <code>&lt;isinclude&gt;</code> embeds another template. <code>&lt;iscomponent&gt;</code> calls a remote include (a controller route that returns HTML)." },
          { type: "callout", callout: "info", title: "Encoding", text: "Always use &lt;isprint value=... encoding='htmlcontent'&gt; for user-generated content to prevent XSS. Use encoding='off' only for trusted HTML fragments." },
          { type: "heading", text: "pdict — the template data dictionary" },
          { type: "p", text: "<code>pdict</code> is the global object in every ISML template that holds data passed from the controller via <code>res.render('template', {key: value})</code>. Access it as <code>pdict.product</code>, <code>pdict.customer</code>, etc." },
          { type: "callout", callout: "tip", title: "Decorators", text: "Use &lt;isdecorate&gt; to wrap a template in a layout decorator (header/footer). The decorator uses &lt;isreplace&gt; to inject the child template's content into the layout." },
        ],
        code: [
          {
            title: "productDetails.isml — core template patterns",
            lang: "xml",
            code: `<isdecorate template="common/layout/page">

<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/product/detail.css');
    assets.addJs('/js/productDetail.js');
</isscript>

<div class="product-detail">

    <!--- Product Name with HTML encoding --->
    <h1 class="product-name">
        <isprint value="\${pdict.product.productName}" encoding="htmlcontent"/>
    </h1>

    <!--- Conditional badge --->
    <isif condition="\${pdict.customBadge}">
        <span class="badge">\${pdict.customBadge}</span>
    </isif>

    <!--- Price --->
    <isinclude template="product/components/prices"/>

    <!--- Loop over images --->
    <isloop items="\${pdict.product.images.large}" var="image" status="loopState">
        <img src="\${image.url}"
             alt="<isprint value='\${image.alt}' encoding='htmlcontent'/>"
             <isif condition="\${loopState.first}">class="primary-image"</isif>
        />
    </isloop>

    <!--- Remote include: calls Cart-MiniCart controller route --->
    <iscomponent pipeline="Cart-MiniCart"/>

</div>

</isdecorate>`,
            explanation: "pdict holds controller data. Always encode user-generated strings. <isdecorate> wraps with a layout. <iscomponent> makes a sub-request to another controller."
          },
          {
            title: "ISML loops and conditionals in depth",
            lang: "xml",
            code: `<!--- Loop with index and first/last detection --->
<isloop items="\${pdict.cart.items}" var="lineItem" status="st">
    <isif condition="\${st.first}"><ul class="cart-items"></isif>

    <li class="cart-item \${st.odd ? 'odd' : 'even'}">
        <isprint value="\${lineItem.productName}" encoding="htmlcontent"/>
        <isnext> <!--- advance iterator manually if needed --->
    </li>

    <isif condition="\${st.last}"></ul></isif>
</isloop>

<!--- Nested if / elseif / else --->
<isif condition="\${pdict.customer.authenticated}">
    <p>Welcome, <isprint value="\${pdict.customer.profile.firstName}"/>!</p>
<iselseif condition="\${pdict.customer.registered}"/>
    <p>Please <a href="\${URLUtils.url('Login-Show')}">log in</a>.</p>
<iselse/>
    <p>Welcome, guest!</p>
</isif>`,
            explanation: "loopState (or 'status' alias) provides first, last, odd, even, count properties. URLUtils.url() generates safe storefront URLs."
          }
        ],
        quiz: [
          {
            q: "What ISML tag do you use to safely output a variable and prevent XSS?",
            options: ["<isoutput>", "<isprint encoding='htmlcontent'>", "${variable}", "<isecho>"],
            correct: 1,
            explanation: "<isprint value='${variable}' encoding='htmlcontent'> is the secure way to output data. Raw ${} interpolation does not encode HTML entities."
          },
          {
            q: "Where is template data stored and how do you access it in ISML?",
            options: ["In 'model' object: model.product", "In 'pdict' (pipeline dictionary): pdict.product", "In 'viewBag': viewBag.product", "In 'req.viewData': req.viewData.product"],
            correct: 1,
            explanation: "pdict (pipeline dictionary) is the global data object in every ISML template. Data set via res.render('template', {product: ...}) is accessed as pdict.product."
          },
          {
            q: "What is the purpose of <isdecorate>?",
            options: ["It adds CSS classes to elements", "It wraps the template in a layout (header/footer), injecting content via <isreplace>", "It caches the template output", "It imports another template's variables"],
            correct: 1,
            explanation: "<isdecorate template='layout/page'> wraps the current template in a layout decorator. The decorator uses <isreplace> to insert the child's content."
          },
          {
            q: "What does <iscomponent pipeline='Cart-MiniCart'/> do?",
            options: ["Imports the Cart cartridge", "Makes a server-side sub-request to the Cart-MiniCart route and inserts its HTML output", "Includes the MiniCart.isml file directly", "Calls a JavaScript function named Cart_MiniCart"],
            correct: 1,
            explanation: "<iscomponent> performs a remote include — it makes an internal controller call to Cart-MiniCart and embeds the rendered HTML into the current template."
          }
        ]
      }
    ]
  },

  // ── MODULE 3 ─────────────────────────────────────────────────────────────
  {
    id: "sfra",
    title: "SFRA (Storefront Reference Architecture)",
    icon: "🏗️",
    color: "#7c3aed",
    type: "b2c",
    description: "The modern B2C development framework: hooks, middleware, SFRA patterns.",
    lessons: [
      {
        id: "sfra-overview",
        title: "SFRA Overview & Middleware",
        duration: "8 min",
        type: "b2c",
        concept: [
          { type: "p", text: "SFRA (Storefront Reference Architecture) is Salesforce's recommended development framework for B2C Commerce. Released in 2018, it replaced the older Pipeline/Form framework with a Node.js-inspired MVC architecture using controllers, middleware, and models." },
          { type: "heading", text: "Middleware Pattern" },
          { type: "p", text: "SFRA controllers use a middleware chain inspired by Express.js. Each route can have multiple middleware functions that run in sequence. Built-in middleware includes authentication checks, cache headers, and CSRF protection." },
          { type: "callout", callout: "info", title: "Key Middleware", text: "userLoggedIn.validateLoggedIn prevents guest access. csrf.validateAjaxRequest protects AJAX forms. cache.applyDefaultCache / cache.applyPromotionSensitiveCache set CDN headers." },
          { type: "heading", text: "Hooks" },
          { type: "p", text: "SFRA provides a <strong>hook system</strong> for cross-cartridge extensibility. Hooks are defined in <code>hooks.json</code> and implemented in scripts. They allow loose coupling — one cartridge publishes a hook point, another implements it without direct dependency." },
        ],
        code: [
          {
            title: "Middleware chain with built-in guards",
            lang: "javascript",
            code: `'use strict';

var server = require('server');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var csrf = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

// Multiple middleware run left→right before your handler
server.get(
    'SavedAddresses',
    server.middleware.https,      // enforce HTTPS
    userLoggedIn.validateLoggedIn, // redirect guests to login
    consentTracking.consent,      // check GDPR consent
    function (req, res, next) {
        var AddressModel = require('*/cartridge/models/address');
        var addresses = req.currentCustomer.addressBook;

        res.render('account/addressBook', {
            addressBook: new AddressModel(addresses)
        });
        return next();
    }
);

// CSRF-protected POST
server.post(
    'SaveAddress',
    server.middleware.https,
    csrf.validateAjaxRequest,
    function (req, res, next) {
        // form data in req.form.*
        res.json({ success: true });
        return next();
    }
);

module.exports = server.exports();`,
            explanation: "Middleware functions run in declaration order. server.middleware.https is built-in. Custom middleware just follows the (req, res, next) signature."
          },
          {
            title: "Defining and implementing a Hook",
            lang: "json",
            code: `// hooks.json in your cartridge root
{
  "hooks": [
    {
      "name": "app.customer.created",
      "script": "~/cartridge/scripts/hooks/customerCreated"
    },
    {
      "name": "app.payment.processor.default",
      "script": "~/cartridge/scripts/hooks/paymentProcessors/default"
    }
  ]
}`,
            explanation: "hooks.json maps hook names to script paths. The ~ refers to the cartridge root. Hooks allow cartridges to respond to platform events."
          }
        ],
        quiz: [
          {
            q: "What does the middleware userLoggedIn.validateLoggedIn do when a guest user hits the route?",
            options: ["Returns a 403 error", "Redirects the user to the Login page", "Throws a JavaScript exception", "Sets req.user to null and continues"],
            correct: 1,
            explanation: "validateLoggedIn redirects unauthenticated (guest) users to the Login-Show route. The remaining middleware and handler do not execute."
          },
          {
            q: "In what order do SFRA middleware functions execute?",
            options: ["Right to left (reverse order)", "Alphabetical order", "Left to right (declaration order), each calling next()", "Simultaneously in parallel"],
            correct: 2,
            explanation: "Middleware runs left to right in declaration order. Each function must call next() to pass control to the next function in the chain."
          },
          {
            q: "What is the purpose of hooks.json?",
            options: ["It configures webpack build hooks", "It maps hook event names to script implementations for loose-coupled extensibility", "It lists all controller routes", "It defines CSS theme hooks"],
            correct: 1,
            explanation: "hooks.json registers your cartridge's hook implementations. The platform calls the registered scripts when hook events are triggered."
          }
        ]
      },
      {
        id: "ocapi",
        title: "OCAPI & SCAPI (REST APIs)",
        duration: "9 min",
        type: "b2c",
        concept: [
          { type: "p", text: "<strong>OCAPI</strong> (Open Commerce API) is SFCC B2C's legacy REST API. It provides two API types: <code>Shop API</code> (consumer-facing: browse products, manage cart, checkout) and <code>Data API</code> (admin: manage catalogs, customers, orders — requires Business Manager credentials)." },
          { type: "p", text: "<strong>SCAPI</strong> (Salesforce Commerce API) is the newer, recommended REST API based on OAuth 2.0 with PKCE. It's split into <code>Shopper APIs</code> (public, for storefronts) and <code>Admin APIs</code> (private, for B2B integrations). SCAPI uses modern JWT-based auth instead of OCAPI's session-based auth." },
          { type: "callout", callout: "info", title: "Migration Note", text: "New headless storefront projects should use SCAPI (Commerce SDK). OCAPI remains supported but Salesforce is investing in SCAPI going forward." },
          { type: "heading", text: "SCAPI Authentication" },
          { type: "p", text: "Shopper APIs use <code>Authorization Code + PKCE</code> flow for registered customers and <code>Client Credentials + Session Bridge</code> for guest sessions. Admin APIs use <code>Client Credentials</code> with a secret. The Account Manager (SLAS) handles token issuance." },
        ],
        code: [
          {
            title: "OCAPI Shop API — add to basket (fetch)",
            lang: "javascript",
            code: `// OCAPI: POST /s/{site-id}/dw/shop/v23_2/baskets/{basket-id}/items
async function addToBasket(siteId, basketId, pid, quantity) {
    const url = \`https://\${host}/s/\${siteId}/dw/shop/v23_2/baskets/\${basketId}/items\`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${shopToken}\`
        },
        body: JSON.stringify([{
            product_id: pid,
            quantity: quantity
        }])
    });

    return response.json();
}`,
            explanation: "OCAPI URLs follow /dw/shop/v{version}/ pattern. Products use snake_case fields. Auth token is obtained via session bridge or OCAPI client credentials."
          },
          {
            title: "SCAPI — get product using Commerce SDK",
            lang: "javascript",
            code: `import { ShopperProducts } from 'commerce-sdk-isomorphic';

const shopperProducts = new ShopperProducts({
    clientId: 'my-client-id',
    organizationId: 'f_ecom_zzzz_prd',
    shortCode: 'kv7kzm78',
    siteId: 'RefArch'
});

// Get product details
const product = await shopperProducts.getProduct({
    parameters: {
        id: '701644289677M',
        allImages: true,
        expand: ['availability', 'promotions', 'options']
    }
});

console.log(product.name, product.price);`,
            explanation: "commerce-sdk-isomorphic is the official Salesforce Commerce SDK. It works in both Node.js and browser environments for headless storefronts."
          }
        ],
        quiz: [
          {
            q: "What is the key difference between OCAPI Data API and Shop API?",
            options: [
              "Data API is faster; Shop API is for mobile only",
              "Shop API is consumer-facing (browse/buy); Data API is admin-facing (manage catalog/orders)",
              "They are the same API with different names",
              "Data API uses REST; Shop API uses GraphQL"
            ],
            correct: 1,
            explanation: "Shop API handles consumer actions (search products, manage basket, checkout). Data API handles administrative actions (create products, manage orders) and requires BM admin credentials."
          },
          {
            q: "What auth standard does SCAPI use for registered shoppers?",
            options: ["Basic Auth (username/password)", "SAML 2.0", "OAuth 2.0 with PKCE (via SLAS)", "API Key in header"],
            correct: 2,
            explanation: "SCAPI uses OAuth 2.0 with PKCE via Salesforce's SLAS (Shopper Login and API Access Service). This enables secure token-based auth for headless storefronts."
          },
          {
            q: "For a new headless B2C storefront project started today, which API should you prioritize?",
            options: ["OCAPI (more mature)", "SCAPI (Salesforce's strategic direction)", "SOAP web services", "GraphQL Commerce API"],
            correct: 1,
            explanation: "SCAPI is Salesforce's strategic API investment. New projects should use SCAPI (Commerce SDK) as OCAPI is in maintenance mode."
          }
        ]
      }
    ]
  },

  // ── MODULE 4 ─────────────────────────────────────────────────────────────
  {
    id: "catalogs-products",
    title: "Catalogs & Products",
    icon: "🗂️",
    color: "#059669",
    type: "both",
    description: "Product types, catalogs, price books, and inventory in B2C and B2B.",
    lessons: [
      {
        id: "product-types",
        title: "Product Types & Catalog Structure",
        duration: "8 min",
        type: "both",
        concept: [
          { type: "p", text: "SFCC B2C supports several product types: <strong>Simple</strong> (single SKU), <strong>Variation Master</strong> (product with color/size variants), <strong>Variation Product</strong> (a specific SKU of a master), <strong>Bundle</strong> (fixed group of products sold together), <strong>Set</strong> (curated group, each item adds to cart separately), and <strong>Option Product</strong> (product with selectable add-ons)." },
          { type: "heading", text: "Catalog Types" },
          { type: "p", text: "B2C uses two types of catalogs: <strong>Master Catalog</strong> — the single source of product data (attributes, images, variations). There should be only one. <strong>Site Catalog</strong> — site-specific categories and product assignments. Multiple sites can have different site catalogs but share one master catalog." },
          { type: "callout", callout: "warning", title: "B2B Difference", text: "In B2B Commerce, products are standard Salesforce Product2 objects with custom fields. Catalogs are implemented via Entitlement Policies and Pricebook Entries — no separate master/site catalog concept." },
          { type: "heading", text: "Price Books" },
          { type: "p", text: "Price books define prices for products. B2C supports list prices, sale prices, and customer-group-specific prices via multiple price books. Price books are XML files imported into Business Manager or managed via the Data API." },
        ],
        code: [
          {
            title: "B2C Catalog XML — product definition",
            lang: "xml",
            code: `<?xml version="1.0" encoding="UTF-8"?>
<catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31"
         catalog-id="my-master-catalog">

    <!-- Variation Master product -->
    <product product-id="shirt-master-001">
        <display-name xml:lang="x-default">Classic T-Shirt</display-name>
        <short-description xml:lang="x-default">Premium cotton tee</short-description>
        <online-flag>true</online-flag>
        <classification-category catalog-id="my-master-catalog">mens-tops</classification-category>

        <!-- Custom attributes -->
        <custom-attributes>
            <custom-attribute attribute-id="material">100% Cotton</custom-attribute>
            <custom-attribute attribute-id="careInstructions">Machine wash cold</custom-attribute>
        </custom-attributes>

        <!-- Variation attributes (color, size) -->
        <variations>
            <attributes>
                <variation-attribute attribute-id="color" variation-attribute-id="color">
                    <display-name xml:lang="x-default">Color</display-name>
                </variation-attribute>
                <variation-attribute attribute-id="size" variation-attribute-id="size">
                    <display-name xml:lang="x-default">Size</display-name>
                </variation-attribute>
            </attributes>
        </variations>
    </product>

    <!-- Specific variant (SKU) -->
    <product product-id="shirt-001-blue-M">
        <upc>123456789012</upc>
        <variation-attribute-values>
            <variation-attribute-value attribute-id="color">blue</variation-attribute-value>
            <variation-attribute-value attribute-id="size">M</variation-attribute-value>
        </variation-attribute-values>
    </product>

</catalog>`,
            explanation: "Catalog XML is the import format for B2C products. The master has variations defined; each variant references the master via its product-id prefix pattern."
          },
          {
            title: "B2C Price Book XML",
            lang: "xml",
            code: `<?xml version="1.0" encoding="UTF-8"?>
<pricebooks xmlns="http://www.demandware.com/xml/impex/pricebook/2006-10-31">
    <pricebook>
        <header pricebook-id="usd-list-prices">
            <currency>USD</currency>
            <display-name xml:lang="x-default">USD List Prices</display-name>
            <online-flag>true</online-flag>
        </header>
        <price-tables>
            <price-table product-id="shirt-001-blue-M">
                <amount quantity="1">29.99</amount>
            </price-table>
        </price-tables>
    </pricebook>
</pricebooks>`,
            explanation: "Price books are imported as XML. Amount can vary by quantity (break pricing). Customer group price books override the list price book at runtime."
          }
        ],
        quiz: [
          {
            q: "A 'Blue, Size M T-Shirt' is what product type in SFCC B2C?",
            options: ["Simple Product", "Variation Master", "Variation Product (SKU)", "Bundle"],
            correct: 2,
            explanation: "A specific color/size combination is a Variation Product (a SKU). The parent 'T-Shirt' with all its variant attributes defined is the Variation Master."
          },
          {
            q: "How many Master Catalogs should a B2C instance have?",
            options: ["One per site", "One per language", "Exactly one (shared across sites)", "One per price book"],
            correct: 2,
            explanation: "Best practice is one master catalog shared across all sites. Each site has its own site catalog for category structure and product assignments."
          },
          {
            q: "In B2B Commerce, what Salesforce object represents a product?",
            options: ["Commerce__Product__c", "Product2", "B2B_Product__c", "CatalogItem__c"],
            correct: 1,
            explanation: "B2B Commerce uses the standard Salesforce Product2 object. Pricing is managed via Pricebook2 and PricebookEntry — standard Salesforce CRM objects."
          }
        ]
      }
    ]
  },

  // ── MODULE 5 ─────────────────────────────────────────────────────────────
  {
    id: "customers-orders",
    title: "Customers & Orders",
    icon: "🛒",
    color: "#dc2626",
    type: "both",
    description: "Customer profiles, baskets, checkout flow, and order management.",
    lessons: [
      {
        id: "customer-model",
        title: "Customer Model & Baskets",
        duration: "8 min",
        type: "b2c",
        concept: [
          { type: "p", text: "In B2C Commerce, customers can be <strong>Authenticated</strong> (registered and logged in), <strong>Registered but not logged in</strong>, or <strong>Guest</strong>. The <code>dw.customer.CustomerMgr</code> API manages customer profiles." },
          { type: "p", text: "A <strong>Basket</strong> is the shopping cart. Every session has at most one open basket, accessible via <code>dw.order.BasketMgr.getCurrentBasket()</code>. Baskets automatically expire after 30 days of inactivity by default." },
          { type: "callout", callout: "info", title: "Basket vs Order", text: "A Basket becomes an Order when the customer completes checkout. Use BasketMgr for pre-purchase and OrderMgr for post-purchase operations." },
          { type: "heading", text: "B2B Differences" },
          { type: "p", text: "In B2B Commerce, customers are Salesforce Contacts linked to Accounts. Cart functionality is managed via the B2B Commerce CartController and stored as B2B Commerce Cart records (not Salesforce Opportunities). Pricing is account-specific via entitlements." },
        ],
        code: [
          {
            title: "Working with Basket (B2C Script API)",
            lang: "javascript",
            code: `'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var ProductMgr = require('dw/catalog/ProductMgr');

function addProductToCart(pid, quantity) {
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var product = ProductMgr.getProduct(pid);

    if (!product) {
        return { error: true, message: 'Product not found' };
    }

    // All basket/order mutations MUST be wrapped in a Transaction
    Transaction.wrap(function () {
        var productLineItems = currentBasket.getProductLineItems(pid);

        if (productLineItems.length > 0) {
            // Update existing line item quantity
            productLineItems[0].setQuantityValue(
                productLineItems[0].quantityValue + quantity
            );
        } else {
            // Add new line item
            currentBasket.createProductLineItem(pid, currentBasket.defaultShipment);
            currentBasket.getProductLineItems(pid)[0].setQuantityValue(quantity);
        }
    });

    return { success: true, basketCount: currentBasket.productQuantityTotal };
}`,
            explanation: "Always wrap basket/order mutations in Transaction.wrap(). BasketMgr.getCurrentOrNewBasket() creates a basket if none exists for this session."
          },
          {
            title: "Reading customer data",
            lang: "javascript",
            code: `// In a controller, access current customer via req.currentCustomer
server.get('Account', userLoggedIn.validateLoggedIn, function (req, res, next) {
    var customer = req.currentCustomer.raw; // dw.customer.Customer object
    var profile = customer.profile;         // dw.customer.Profile

    var customerData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        creationDate: profile.creationDate,
        orderCount: customer.activeData.orders,

        // Address book
        addresses: customer.addressBook.addresses.toArray().map(function (addr) {
            return {
                id: addr.ID,
                city: addr.city,
                countryCode: addr.countryCode.value,
                isDefault: addr.ID === customer.addressBook.preferredAddress.ID
            };
        })
    };

    res.render('account/dashboard', { customer: customerData });
    return next();
});`,
            explanation: "req.currentCustomer.raw gives access to the SFCC dw.customer.Customer object. The profile contains personal data; activeData has order history stats."
          }
        ],
        quiz: [
          {
            q: "What SFCC API class creates or retrieves the current session basket?",
            options: ["dw.order.OrderMgr", "dw.order.BasketMgr", "dw.system.Session", "dw.catalog.CartMgr"],
            correct: 1,
            explanation: "dw.order.BasketMgr manages baskets. BasketMgr.getCurrentBasket() returns the basket if one exists; getCurrentOrNewBasket() creates one if needed."
          },
          {
            q: "Why must basket mutations be wrapped in Transaction.wrap()?",
            options: [
              "For performance caching",
              "To ensure atomicity — SFCC database changes require transactions to commit or rollback together",
              "Transaction.wrap is only needed for order placement",
              "It's optional; best practice only"
            ],
            correct: 1,
            explanation: "SFCC's persistent object model (POM) requires all database mutations to occur within a Transaction. Without it, changes will not persist."
          },
          {
            q: "In B2B Commerce, a customer is represented as which Salesforce object?",
            options: ["Lead", "Account", "Contact (linked to an Account)", "User"],
            correct: 2,
            explanation: "B2B Commerce customers are Contacts associated with an Account. The Account represents the buying company; the Contact is the individual buyer."
          }
        ]
      },
      {
        id: "orders-oms",
        title: "Orders & Order Management",
        duration: "7 min",
        type: "both",
        concept: [
          { type: "p", text: "When a B2C basket is submitted, <code>CheckoutServices.placeOrder()</code> creates an <strong>Order</strong> object. Orders go through status transitions: <code>CREATED → OPEN → COMPLETED</code> (or <code>CANCELLED</code>). Orders are immutable once placed — you create records, don't modify the basket." },
          { type: "p", text: "<strong>Salesforce Order Management (OMS)</strong> is the post-purchase platform for fulfillment, returns, and customer service. Both B2C and B2B can integrate with OMS. B2C sends orders via the SFCC Platform Events integration; B2B uses native Salesforce Order records." },
          { type: "callout", callout: "tip", title: "Order Attributes", text: "Use custom order attributes (System Object Types in BM) to store channel info, source details, or integration IDs on the order without modifying the base schema." },
          { type: "heading", text: "Payment Integrations" },
          { type: "p", text: "Payment processors integrate via the <code>PaymentProcessor</code> hook. Common integrations: Salesforce Payments, Adyen, Stripe, CyberSource. Each implements the <code>app.payment.processor.{name}</code> hooks for authorization, capture, and refund." },
        ],
        code: [
          {
            title: "Placing an order from basket (B2C)",
            lang: "javascript",
            code: `var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var Order = require('dw/order/Order');

server.post('PlaceOrder', server.middleware.https, function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.json({ error: true, cartError: true });
        return next();
    }

    // Validate basket completeness
    var validationOrder = COHelpers.validateOrder(currentBasket);
    if (validationOrder.error) {
        res.json({ error: true, errorMessage: validationOrder.message });
        return next();
    }

    var order;
    Transaction.wrap(function () {
        // Creates the Order record from the basket
        order = COHelpers.createOrder(currentBasket);
    });

    if (!order) {
        res.json({ error: true, errorMessage: 'Could not create order' });
        return next();
    }

    // Handle payment authorization
    var handlePaymentResult = COHelpers.handlePayments(order, order.orderNo);
    if (handlePaymentResult.error) {
        Transaction.wrap(function () {
            order.setConfirmationStatus(Order.CONFIRMATION_STATUS_NOTCONFIRMED);
        });
        res.json({ error: true, errorMessage: 'Payment failed' });
        return next();
    }

    // Finalize and send confirmation email
    COHelpers.sendConfirmationEmail(order, req.locale.id);

    res.json({
        error: false,
        orderID: order.orderNo,
        orderToken: order.orderToken,
        continueUrl: URLUtils.url('Order-Confirm').toString()
    });

    return next();
});`,
            explanation: "Order placement creates an immutable Order from the basket. Always handle payment before marking the order confirmed. Send confirmation email after success."
          }
        ],
        quiz: [
          {
            q: "After a B2C basket is submitted, what is the initial order status?",
            options: ["OPEN", "CREATED", "NEW", "PENDING"],
            correct: 1,
            explanation: "Newly placed orders have status CREATED. They transition to OPEN when confirmed and COMPLETED when fulfilled."
          },
          {
            q: "True or False: You can modify a basket after the order has been placed from it.",
            options: ["True", "False"],
            correct: 1,
            explanation: "False. Once an order is created from a basket, the basket is cleared. Orders are managed via OrderMgr, not BasketMgr. Post-placement changes require order modification APIs."
          }
        ]
      }
    ]
  },

  // ── MODULE 6 ─────────────────────────────────────────────────────────────
  {
    id: "b2b-commerce",
    title: "B2B Commerce Deep Dive",
    icon: "🏢",
    color: "#d97706",
    type: "b2b",
    description: "B2B-specific: account hierarchies, entitlements, CPQ, re-order, and LWC storefront.",
    lessons: [
      {
        id: "b2b-accounts",
        title: "Account Hierarchies & Entitlements",
        duration: "8 min",
        type: "b2b",
        concept: [
          { type: "p", text: "B2B Commerce is designed for complex buying scenarios: multiple buyers per company, tiered pricing, purchase approval workflows, and account-based catalogs. These are modelled using standard Salesforce CRM objects." },
          { type: "heading", text: "Account Hierarchy" },
          { type: "p", text: "The buying company is an <strong>Account</strong>. Individual buyers are <strong>Contacts</strong> linked to that Account. B2B Commerce adds a <code>Buyer Account</code> record (B2B-specific) that connects the Account to the storefront, configuring payment methods, addresses, and spending limits." },
          { type: "callout", callout: "info", title: "Buyer User", text: "B2B Commerce users log in as Experience Cloud users (Community Users). Their Contact must be linked to an Account that has a Buyer Account record — otherwise they cannot place orders." },
          { type: "heading", text: "Entitlement Policies" },
          { type: "p", text: "Entitlement Policies control which products a buyer account can see and purchase. A policy links a set of products to a set of buyer accounts. Without an entitlement policy, an account cannot see any products — this is the default deny model." },
          { type: "callout", callout: "warning", title: "Common Issue", text: "If a buyer can log in but sees no products, check: (1) Entitlement Policy created and activated, (2) Account linked to the policy, (3) Products added to the policy, (4) Pricebook entry exists for those products." },
        ],
        code: [
          {
            title: "SOQL — query buyer account + entitlements",
            lang: "javascript",
            code: `// Apex: get buyer account for a community user
public class BuyerAccountHelper {

    public static BuyerAccount getBuyerAccount(Id contactId) {
        // Find the Account linked to this Contact
        Contact contact = [
            SELECT AccountId FROM Contact WHERE Id = :contactId LIMIT 1
        ];

        // Find the BuyerAccount for this Account
        BuyerAccount buyerAccount = [
            SELECT Id, Name, IsActive, BuyerStatus,
                   CommerceType, CurrencyIsoCode
            FROM BuyerAccount
            WHERE BuyerId = :contact.AccountId
            AND IsActive = true
            LIMIT 1
        ];

        return buyerAccount;
    }

    public static List<Product2> getEntitledProducts(Id buyerAccountId) {
        // Get products available via entitlement policies
        return [
            SELECT Id, Name, ProductCode, IsActive
            FROM Product2
            WHERE Id IN (
                SELECT Product2Id FROM CommerceEntitlementProduct
                WHERE PolicyId IN (
                    SELECT CommerceEntitlementPolicyId
                    FROM CommerceEntitlementBuyerGroup
                    WHERE BuyerGroupId IN (
                        SELECT BuyerGroupId
                        FROM BuyerGroupMember
                        WHERE BuyerId = :buyerAccountId
                    )
                )
            )
            AND IsActive = true
        ];
    }
}`,
            explanation: "Entitlement flow: BuyerAccount → BuyerGroup → EntitlementPolicy → Product2. All are standard B2B Commerce records queryable via SOQL."
          },
          {
            title: "LWC — add to cart component (B2B storefront)",
            lang: "javascript",
            code: `// cartButton.js — B2B storefront LWC component
import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getCurrentCartId, addItemToCart } from 'commerce/cartApiInternal';
import { publish, MessageContext } from 'lightning/messageService';
import CART_CHANGED_MESSAGE from '@salesforce/messageChannel/cartChanged__c';

export default class CartButton extends NavigationMixin(LightningElement) {
    @api productId;
    @api quantity = 1;

    @wire(MessageContext)
    messageContext;

    async handleAddToCart() {
        try {
            const cartId = await getCurrentCartId();
            await addItemToCart(cartId, {
                productId: this.productId,
                quantity: this.quantity,
                type: 'Product'
            });

            // Notify cart header to update count
            publish(this.messageContext, CART_CHANGED_MESSAGE, {});

            this.dispatchEvent(new CustomEvent('addtocart', {
                detail: { productId: this.productId }
            }));
        } catch (error) {
            console.error('Add to cart failed:', error);
        }
    }
}`,
            explanation: "B2B storefront uses LWC components and the commerce/cartApiInternal module. Lightning Message Service (LMS) coordinates cart count updates across components."
          }
        ],
        quiz: [
          {
            q: "In B2B Commerce, what record connects a Salesforce Account to the storefront and configures payment/ordering settings?",
            options: ["Commerce Account", "Buyer Account", "Storefront Profile", "Account Extension"],
            correct: 1,
            explanation: "The Buyer Account record (B2B-specific) links a Salesforce Account to the B2B storefront and stores commerce-specific settings like payment methods, buying limits, and status."
          },
          {
            q: "A B2B buyer logs in successfully but sees no products. What is the FIRST thing to check?",
            options: [
              "Reload the page",
              "Check that an active Entitlement Policy links the buyer's account to products with pricebook entries",
              "Check the product's inventory level",
              "Verify the buyer's shipping address"
            ],
            correct: 1,
            explanation: "B2B Commerce uses a default-deny model for products. If no Entitlement Policy links the buyer to products (with active pricebook entries), nothing is visible."
          },
          {
            q: "What is the Experience Cloud role for B2B Commerce buyers?",
            options: ["Internal Salesforce User", "Community User (Experience Cloud User)", "B2B Portal User", "Commerce Agent"],
            correct: 1,
            explanation: "B2B buyers authenticate as Experience Cloud (Community) Users. Their profile type must be a Customer Community or Customer Community Plus profile."
          }
        ]
      },
      {
        id: "b2b-checkout",
        title: "B2B Checkout & Approval Flows",
        duration: "7 min",
        type: "b2b",
        concept: [
          { type: "p", text: "B2B Commerce checkout supports complex purchase scenarios not needed in B2C: <strong>Purchase Approval Workflows</strong>, <strong>PO Number entry</strong>, <strong>Account-level payment terms</strong> (Net 30, Net 60), and <strong>multi-ship</strong> to different locations." },
          { type: "heading", text: "Purchase Approvals" },
          { type: "p", text: "Approval rules are configured per Buyer Account. Common rules: order total exceeds $X requires manager approval, certain product categories require procurement sign-off. Approval workflows use standard Salesforce Approval Processes configured in Setup." },
          { type: "callout", callout: "tip", title: "Approval Status", text: "When an order is pending approval, its status is 'Pending Approval'. The approver receives an email and can approve/reject from the storefront or via Salesforce mobile app." },
          { type: "heading", text: "Reorder & Quick Order" },
          { type: "p", text: "B2B Commerce includes built-in <strong>Reorder</strong> (re-add items from a past order with one click) and <strong>Quick Order</strong> (enter SKUs directly without browsing) — essential for repeat B2B buyers who know their part numbers." },
        ],
        code: [
          {
            title: "Approval Process configuration (metadata XML)",
            lang: "xml",
            code: `<!-- ApprovalProcess definition (deployable via Metadata API) -->
<ApprovalProcess xmlns="http://soap.sforce.com/2006/04/metadata">
    <active>true</active>
    <allowRecall>true</allowRecall>
    <name>HighValueOrderApproval</name>
    <label>High Value Order Approval</label>
    <description>Orders over $5000 require manager approval</description>
    <entryCriteria>
        <criteriaItems>
            <field>OrderSummary.GrandTotalAmount</field>
            <operation>greaterThan</operation>
            <value>5000</value>
        </criteriaItems>
    </entryCriteria>
    <approvalStep>
        <name>ManagerApproval</name>
        <label>Manager Approval</label>
        <assignedApprover>
            <approver>
                <name>Manager</name>
                <type>relatedUserField</type>
            </approver>
            <whenMultipleApprovers>FirstResponse</whenMultipleApprovers>
        </assignedApprover>
    </approvalStep>
</ApprovalProcess>`,
            explanation: "Approval Processes are standard Salesforce metadata. They can be deployed via Salesforce CLI (sf project deploy) and configured in Setup > Approval Processes."
          }
        ],
        quiz: [
          {
            q: "What happens to a B2B order when it exceeds the buyer's spending limit and requires approval?",
            options: [
              "The order is automatically cancelled",
              "The order status becomes 'Pending Approval' and an approver is notified",
              "The buyer is asked to split the order",
              "The excess amount is charged to a default credit card"
            ],
            correct: 1,
            explanation: "Orders requiring approval move to 'Pending Approval' status. The approver (e.g., manager) is notified via email and can approve/reject from the storefront or Salesforce app."
          },
          {
            q: "What B2B Commerce feature allows buyers to enter product SKUs directly without browsing?",
            options: ["Express Checkout", "Quick Order", "Bulk Add", "SKU Search"],
            correct: 1,
            explanation: "Quick Order lets B2B buyers enter known SKU/part numbers directly to add to cart — essential for procurement teams who order the same items repeatedly."
          }
        ]
      }
    ]
  },

  // ── MODULE 7 ─────────────────────────────────────────────────────────────
  {
    id: "jobs-customization",
    title: "Jobs, Custom Objects & Integrations",
    icon: "⚙️",
    color: "#0891b2",
    type: "both",
    description: "Scheduled jobs, custom attributes, site preferences, and integration patterns.",
    lessons: [
      {
        id: "jobs",
        title: "Scheduled Jobs & Pipelines",
        duration: "7 min",
        type: "b2c",
        concept: [
          { type: "p", text: "SFCC B2C has a <strong>Job Framework</strong> for batch processing and scheduled tasks. Jobs are configured in Business Manager under <code>Administration > Operations > Jobs</code>. They run scheduled scripts, import/export data, rebuild search indexes, and send marketing emails." },
          { type: "p", text: "A Job consists of one or more <strong>Steps</strong>. Built-in step types include: <code>ExecuteScriptModule</code> (run your custom JS), <code>ImportCatalog</code>, <code>ExportOrders</code>, <code>SendMail</code>. Steps run sequentially within a job; jobs can be scheduled on cron expressions or triggered via OCAPI/SCAPI." },
          { type: "callout", callout: "tip", title: "Job Logging", text: "Use dw.system.Logger.getLogger('myJob', 'jobLog') for structured job logging. Logs appear in Business Manager under Administration > Site Development > Log Center." },
          { type: "heading", text: "Custom Site Preferences" },
          { type: "p", text: "Site Preferences store configuration values (feature flags, API keys, thresholds) that merchants can edit in BM without code changes. Define them in <code>System Object Types > SitePreferences</code> in BM, then read them via <code>dw.system.Site.current.getCustomPreferenceValue('myPref')</code>." },
        ],
        code: [
          {
            title: "Custom Job Step script",
            lang: "javascript",
            code: `/**
 * Job step: sync loyalty points from external system
 * Configure in BM: Job > Step > ExecuteScriptModule
 * Script Module: int_loyalty/cartridge/scripts/jobs/syncLoyaltyPoints
 * Function: execute
 */
'use strict';

var Logger = require('dw/system/Logger');
var Site = require('dw/system/Site');
var CustomerMgr = require('dw/customer/CustomerMgr');
var Transaction = require('dw/system/Transaction');

var log = Logger.getLogger('loyaltySync', 'loyaltySync');

/**
 * @param {Object} parameters - Job step parameters (configured in BM)
 * @param {dw.job.JobStepExecution} stepExecution
 */
function execute(parameters, stepExecution) {
    var batchSize = parameters.BatchSize || 100;
    var apiEndpoint = Site.current.getCustomPreferenceValue('loyaltyApiEndpoint');

    log.info('Starting loyalty sync. BatchSize: {0}', batchSize);

    var processedCount = 0;
    var errorCount = 0;

    try {
        // Fetch updates from external system
        var updates = fetchLoyaltyUpdates(apiEndpoint, batchSize);

        updates.forEach(function (update) {
            var customer = CustomerMgr.getCustomerByLogin(update.email);
            if (customer) {
                Transaction.wrap(function () {
                    customer.profile.custom.loyaltyPoints = update.points;
                    customer.profile.custom.loyaltyTier = update.tier;
                });
                processedCount++;
            } else {
                log.warn('Customer not found: {0}', update.email);
                errorCount++;
            }
        });

        log.info('Sync complete. Processed: {0}, Errors: {1}', processedCount, errorCount);

    } catch (e) {
        log.error('Loyalty sync failed: {0}', e.message);
        // Returning ERROR status marks the job step as failed in BM
        return new Status(Status.ERROR, 'SYNC_FAILED', e.message);
    }

    return new Status(Status.OK);
}

module.exports = { execute: execute };`,
            explanation: "Job steps export an execute() function. Return Status.OK or Status.ERROR. Use dw.system.Logger with a named logger for structured log output in Log Center."
          },
          {
            title: "Reading Site Preferences",
            lang: "javascript",
            code: `var Site = require('dw/system/Site');

// Read a custom site preference
var currentSite = Site.current;
var loyaltyEnabled = currentSite.getCustomPreferenceValue('loyaltyProgramEnabled');
var apiKey = currentSite.getCustomPreferenceValue('externalApiKey');
var maxItems = currentSite.getCustomPreferenceValue('cartMaxItems'); // number

// Built-in site properties
var siteId = currentSite.ID;             // 'RefArch'
var locale = currentSite.defaultLocale;  // 'en_US'
var currency = currentSite.defaultCurrency; // 'USD'

if (loyaltyEnabled) {
    // Feature flag check before running loyalty logic
}`,
            explanation: "Site preferences are the merchant-editable config layer. Define them in BM under Administration > Site Development > System Object Types > SitePreferences."
          }
        ],
        quiz: [
          {
            q: "Where do you configure a scheduled job in SFCC B2C?",
            options: [
              "In a cron.json file in your cartridge",
              "Business Manager > Administration > Operations > Jobs",
              "In the dw.json configuration file",
              "Via the SFCC CLI only"
            ],
            correct: 1,
            explanation: "Jobs are configured in Business Manager under Administration > Operations > Jobs. You define job steps, their parameters, and the schedule (cron expression or manual)."
          },
          {
            q: "What does a Job Step script's execute() function need to return to signal failure?",
            options: ["throw new Error('failed')", "return false", "return new Status(Status.ERROR, 'CODE', 'message')", "return null"],
            correct: 2,
            explanation: "Job steps return a dw.system.Status object. Status.OK marks the step as successful; Status.ERROR marks it as failed and stops subsequent steps (unless configured otherwise)."
          },
          {
            q: "What API class reads a custom site preference value?",
            options: [
              "dw.system.Preferences.get('key')",
              "dw.system.Site.current.getCustomPreferenceValue('key')",
              "dw.system.Config.getPreference('key')",
              "SitePreferences.getValue('key')"
            ],
            correct: 1,
            explanation: "dw.system.Site.current.getCustomPreferenceValue('attributeId') reads site preferences. The attribute must first be defined in BM under System Object Types > SitePreferences."
          }
        ]
      }
    ]
  }
];

window.CURRICULUM = CURRICULUM;
