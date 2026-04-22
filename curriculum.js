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
  },

  // ── MODULE 8 ─────────────────────────────────────────────────────────────
  {
    id: "web-services-integrations",
    title: "Web Services & Integrations",
    icon: "🔌",
    color: "#7c3aed",
    type: "b2c",
    description: "The Service Framework: HTTP, SOAP, FTP integrations, circuit breakers, rate limiting, and logging.",
    lessons: [
      {
        id: "service-framework",
        title: "Service Framework Architecture",
        duration: "10 min",
        type: "b2c",
        concept: [
          { type: "p", text: "The B2C Commerce <strong>Service Framework</strong> is the official way to make outbound calls to external systems (payment gateways, ERPs, PIM systems, etc.). It manages call execution, monitors performance, and enforces configurable rate and circuit-breaker limits. Never use raw <code>dw.net.HTTPClient</code> directly outside the framework." },
          { type: "heading", text: "Three Required Configurations" },
          { type: "p", text: "Every service needs three Business Manager records: <strong>Service Configuration</strong> (references credential + profile, generates the <code>ServiceConfig</code> object), <strong>Service Credential</strong> (stores URL, username, password for basic auth), and <strong>Service Profile</strong> (timeout, circuit-breaker thresholds, rate limits). Naming convention for credentials: <code>http.mysite.myservice.cred</code> — no spaces." },
          { type: "callout", callout: "info", title: "Service Types", text: "HTTP, HTTP Form, FTP, SFTP, SOAP, and Generic. HTTP uses dw.net.HTTPClient. SOAP uses webreferences2/ folder with .wsdl files. Generic lets you implement any protocol manually." },
          { type: "heading", text: "Callback Execution Order" },
          { type: "p", text: "When you call <code>service.call()</code>, the framework runs callbacks in a fixed sequence: <code>initServiceClient()</code> (SOAP only — creates the port), <code>createRequest()</code> (set headers, body, params), <code>execute()</code> (performs the actual call), <code>parseResponse()</code> (converts raw response to your return object). The framework checks rate limits and circuit-breaker state before executing." },
          { type: "heading", text: "Circuit Breaker & Rate Limiter" },
          { type: "p", text: "The <strong>circuit breaker</strong> suspends calls when failure thresholds are reached within a configured interval. Triggers include: unknown host, connection timeout, connection refused, HTTP 500/503, and explicitly thrown exceptions. Note: HTTP 4xx errors do NOT trip the circuit breaker. The <strong>rate limiter</strong> allows a maximum number of calls per time interval; exceeding it throws <code>ServiceUnavailableException</code>." },
          { type: "callout", callout: "warning", title: "Timeout Trap", text: "Default timeouts are 2 minutes (storefront) and 15 minutes (jobs). A 5-second timeout does NOT mean the call finishes in 5 seconds — it means no single operation exceeds 5 seconds. A connection (4s) + two reads (4s each) = 13 seconds total without triggering the timeout." },
        ],
        code: [
          {
            title: "Creating an HTTP service with LocalServiceRegistry",
            lang: "javascript",
            code: `'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

/**
 * Creates a reusable service instance.
 * The service config name must match what's defined in Business Manager
 * under Administration > Operations > Services > Service Configurations.
 */
function getLoyaltyService() {
    return LocalServiceRegistry.createService('http.loyalty.api', {

        // Step 1: build the request
        createRequest: function (svc, params) {
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('X-API-Key', svc.configuration.credential.password);
            svc.setRequestMethod('POST');
            // URL from credential + path suffix
            svc.setURL(svc.configuration.credential.URL + '/v1/points');
            return JSON.stringify(params);
        },

        // Step 2: parse the response into a plain object
        parseResponse: function (svc, httpClient) {
            return JSON.parse(httpClient.text);
        },

        // Optional: override error message
        filterLogMessage: function (msg) {
            // Mask API keys in logs
            return msg.replace(/X-API-Key: [^\\n]+/, 'X-API-Key: [REDACTED]');
        }
    });
}

// Usage in a controller or job step
function awardPoints(customerId, points) {
    var svc = getLoyaltyService();
    var result = svc.call({ customerId: customerId, points: points });

    if (result.ok) {
        return result.object; // parsed JSON from parseResponse()
    }
    var Logger = require('dw/system/Logger');
    Logger.getLogger('loyalty').error('Service call failed: {0}', result.errorMessage);
    return null;
}`,
            explanation: "LocalServiceRegistry.createService() wires your callbacks into the framework. result.ok is true on HTTP 2xx. result.object is what parseResponse() returns."
          },
          {
            title: "SOAP service setup (webreferences2 folder)",
            lang: "text",
            code: `cartridge/
└── webreferences2/
    ├── TaxService.wsdl          ← WSDL definition
    ├── TaxService.jks           ← optional: WS-Security keystore
    └── TaxService.wsdl.properties  ← optional: namespace collision fixes

// In your service callback object, add initServiceClient():
initServiceClient: function(svc) {
    // The framework generates stub classes from the WSDL
    // Access via svc.serviceClient (the port object)
    var port = svc.serviceClient.getCalculateTaxPort();
    svc.serviceClient = port;
},

createRequest: function(svc, params) {
    // Build SOAP request object using generated stubs
    var request = new webreferences2.TaxService.CalculateRequest();
    request.setOrderId(params.orderId);
    return request;
}`,
            explanation: "WSDL files go in webreferences2/. The framework generates Java/JS stub classes. Run the pipeline to regenerate stubs after WSDL changes before deploying to production."
          },
          {
            title: "Service logging & monitoring",
            lang: "text",
            code: `// Log file naming pattern:
service-<prefix>-<internalID>-<date>.log

// Log category hierarchy:
services.<type>.<cartridge>.<service>.<operation>.<message_type>

// message_type values:
//   head  → success/failure summary after each call
//   comm  → full request+response payload (enable at INFO level)
//   log   → init traces, misc messages

// Monitor real-time in Business Manager:
// Administration > Operations > Service Status
// Shows trends, per-service drilldown, 10 days retention

// Enable comm logging for a service (Business Manager):
// Service Configurations > [service] > Log Level > INFO`,
            explanation: "comm-level logging captures full request/response payloads — useful for debugging but should be disabled in production to avoid logging sensitive data."
          }
        ],
        quiz: [
          {
            q: "What are the three required Business Manager records for every web service?",
            options: [
              "Service URL, Service Token, Service Timeout",
              "Service Configuration, Service Credential, Service Profile",
              "Service Definition, Service Policy, Service Endpoint",
              "Service Name, Service Secret, Service Rate"
            ],
            correct: 1,
            explanation: "Every service needs: Service Credential (URL/user/pass), Service Profile (timeouts/rate limits/circuit breaker), and Service Configuration (links credential + profile together)."
          },
          {
            q: "Which HTTP status codes trigger the circuit breaker?",
            options: [
              "All HTTP errors including 4xx and 5xx",
              "Only HTTP 500 and 503, plus connection-level failures",
              "Only connection timeouts",
              "HTTP 400, 404, and 500"
            ],
            correct: 1,
            explanation: "The circuit breaker trips on connection-level failures (timeout, refused, unknown host) and HTTP 500/503. HTTP 4xx errors (bad request, not found) are treated as application errors, not service failures."
          },
          {
            q: "Where do WSDL files for SOAP services go in a cartridge?",
            options: [
              "cartridge/scripts/webservices/",
              "cartridge/webreferences2/",
              "cartridge/services/soap/",
              "cartridge/lib/wsdl/"
            ],
            correct: 1,
            explanation: "SOAP WSDL files (and optional .jks keystores and .wsdl.properties) go in cartridge/webreferences2/. The framework generates stub classes from these files."
          },
          {
            q: "What does filterLogMessage() do in a service callback?",
            options: [
              "Filters which log level to use",
              "Masks sensitive data in log output before it is written",
              "Disables logging for that service",
              "Filters which HTTP methods get logged"
            ],
            correct: 1,
            explanation: "filterLogMessage() intercepts log output and lets you redact sensitive data (API keys, passwords, PII) before it's written to the log file."
          }
        ]
      }
    ]
  },

  // ── MODULE 9 ─────────────────────────────────────────────────────────────
  {
    id: "caching-performance",
    title: "Caching & Performance",
    icon: "⚡",
    color: "#d97706",
    type: "b2c",
    description: "Server-side caching, custom caches, CDN strategy, performance budgets, and the code profiler.",
    lessons: [
      {
        id: "response-caching",
        title: "Response Caching & CDN Strategy",
        duration: "9 min",
        type: "b2c",
        concept: [
          { type: "p", text: "B2C Commerce uses <strong>Fastly</strong> as its CDN. Controllers emit cache headers via SFRA middleware functions that tell Fastly how long to cache a response. Getting caching right is the single highest-leverage performance optimisation available — a cache hit eliminates ALL server-side execution." },
          { type: "heading", text: "Cache Middleware in SFRA" },
          { type: "p", text: "<code>cache.applyDefaultCache</code> sets a standard TTL appropriate for most category/product pages. <code>cache.applyPromotionSensitiveCache</code> uses a shorter TTL (or no cache) when active promotions could change the displayed price. <code>cache.applyShortPromotionSensitiveCache</code> is for pages that must reflect promotions within minutes." },
          { type: "callout", callout: "warning", title: "Personalised Responses", text: "Never cache personalised content (customer name, basket count, loyalty tier) at the CDN level. Use remote includes (<iscomponent>) or client-side AJAX fetches for those fragments, and cache the static shell." },
          { type: "heading", text: "Custom Caches" },
          { type: "p", text: "Custom caches (via <code>dw.system.CacheMgr</code>) store expensive-to-calculate data in application-server memory. Total budget is ~20 MB across all custom caches per application server. Maximum 128 KB per cache entry. Up to 100 caches per code version. Caches are per-server and not synchronised across the cluster." },
          { type: "callout", callout: "info", title: "Cache Invalidation", text: "Custom caches are cleared on code deployment, data replication, and code replication. There is no guarantee an entry survives — always code the loader function as a fallback." },
          { type: "heading", text: "Performance Budget" },
          { type: "p", text: "Shopper APIs must respond in under <strong>10 seconds</strong> or a HTTP 504 is returned and the transaction fails. Responsibility is shared: Salesforce owns API code reliability; you own catalog quality, request parameters, and custom code performance. Use the <code>select</code> parameter to request only needed properties and avoid unnecessary expansions that reduce cache effectiveness." },
        ],
        code: [
          {
            title: "SFRA cache middleware patterns",
            lang: "javascript",
            code: `'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

// Standard product page — cache for default TTL (hours)
server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    // This response will be cached by Fastly
    res.render('product/productDetails', { /* ... */ });
    return next();
});

// Promotion-sensitive page — shorter TTL
server.get('Category', cache.applyPromotionSensitiveCache, function (req, res, next) {
    res.render('search/searchResults', { /* ... */ });
    return next();
});

// Never cache: account pages, cart, checkout
server.get('Account',
    server.middleware.https,
    userLoggedIn.validateLoggedIn,
    // No cache middleware — always live
    function (req, res, next) {
        res.render('account/accountDashboard', { /* ... */ });
        return next();
    }
);`,
            explanation: "Cache middleware must come before your handler in the middleware chain. Never apply cache middleware to authenticated or personalised routes."
          },
          {
            title: "Custom Cache with CacheMgr",
            lang: "javascript",
            code: `'use strict';

var CacheMgr = require('dw/system/CacheMgr');

// Cache definition lives in cartridge/cache/customCaches.json:
// { "caches": [{ "id": "loyaltyTiers", "expirationSeconds": 3600 }] }

function getLoyaltyTiers() {
    // getCache() retrieves the cache by its config ID
    var cache = CacheMgr.getCache('loyaltyTiers');

    // cache.get(key, loader) — returns cached value or calls loader
    var tiers = cache.get('all', function () {
        // This loader only runs on a cache miss
        var svc = require('*/cartridge/scripts/services/loyaltyService');
        var result = svc.call();
        if (result.ok) {
            return result.object.tiers; // must be < 128 KB
        }
        return null; // null is stored; undefined is rejected
    });

    return tiers;
}

// Invalidate a specific key on an application server
function invalidateTiersOnThisServer() {
    var cache = CacheMgr.getCache('loyaltyTiers');
    cache.invalidate('all'); // only clears on THIS app server
}`,
            explanation: "cache.get(key, loader) is the atomic get-or-load pattern. The loader runs only on cache miss. Remember: 20 MB total, 128 KB per entry, per-server only."
          },
          {
            title: "Avoiding the expansion performance trap (SCAPI)",
            lang: "javascript",
            code: `// BAD — retrieves all expansions, large response, poor cache hit rate
const product = await shopperProducts.getProduct({
    parameters: { id: '123', expand: ['availability','promotions','options','images','prices'] }
});

// GOOD — only what the PDP actually needs, smaller response, better caching
const product = await shopperProducts.getProduct({
    parameters: {
        id: '123',
        expand: ['images', 'prices'],
        // select only the fields you render
        select: '(id,name,price,images.(link,alt),c_badge)'
    }
});

// Availability caches for only 60 seconds — don't include it
// on pages that don't display stock messaging
// Promotions similarly reduce cache TTL significantly`,
            explanation: "Every expansion adds response size and reduces cache effectiveness. availability and promotions have very short cache TTLs — only request them where shown."
          }
        ],
        quiz: [
          {
            q: "What is the maximum memory budget for all custom caches combined on one application server?",
            options: ["128 MB", "1 GB", "~20 MB", "512 KB"],
            correct: 2,
            explanation: "~20 MB is reserved for all custom caches on each application server. Maximum per-entry size is 128 KB. Caches are not shared across servers in the cluster."
          },
          {
            q: "What happens when a Shopper API call takes longer than 10 seconds?",
            options: [
              "The response is queued and retried",
              "A HTTP 504 timeout is returned and the transaction fails",
              "The request continues in the background",
              "A warning is logged but the response still arrives"
            ],
            correct: 1,
            explanation: "Shopper APIs must respond in under 10 seconds. Exceeding this returns HTTP 504 and the transaction fails — the customer cannot complete their action."
          },
          {
            q: "Why should you avoid the 'availability' expansion on most cached pages?",
            options: [
              "It increases response size by 10x",
              "Availability data caches for only 60 seconds, drastically reducing CDN cache hit rates",
              "It requires an extra database query per product",
              "It is deprecated in SCAPI"
            ],
            correct: 1,
            explanation: "The availability expansion has a cache TTL of only 60 seconds. Including it on pages that cache for hours means those pages effectively bypass CDN caching."
          },
          {
            q: "Custom cache invalidate() only clears the entry on one server. Why does this matter?",
            options: [
              "It doesn't matter — caches synchronise within 5 seconds",
              "Other app servers in the cluster keep stale data until their entries expire or are cleared separately",
              "invalidate() fails silently if called on a different server",
              "It triggers a full cache flush on all servers"
            ],
            correct: 1,
            explanation: "Custom caches are per-application-server and are NOT synchronised across the cluster. invalidate() only clears on the server where the call executes. Design your cache TTLs accordingly."
          }
        ]
      }
    ]
  },

  // ── MODULE 10 ─────────────────────────────────────────────────────────────
  {
    id: "promotions-campaigns",
    title: "Promotions & Campaigns",
    icon: "🏷️",
    color: "#dc2626",
    type: "b2c",
    description: "Campaign structure, promotion types, qualifiers, coupons, and reading promotions in code.",
    lessons: [
      {
        id: "promotions-overview",
        title: "Campaign & Promotion Structure",
        duration: "9 min",
        type: "b2c",
        concept: [
          { type: "p", text: "Promotions in B2C Commerce are organised in a hierarchy: <strong>Campaign → Experience → Promotion</strong>. A <strong>Campaign</strong> is a container with a date range and an assigned customer group or source code. <strong>Experiences</strong> are segments within a campaign (e.g. 'VIP Email Blast'). <strong>Promotions</strong> are the actual discount rules attached to an experience." },
          { type: "heading", text: "Promotion Types" },
          { type: "p", text: "<strong>Product promotions</strong> discount specific products or categories (e.g. 20% off all footwear). <strong>Order promotions</strong> discount the entire order total (e.g. $10 off orders over $75). <strong>Shipping promotions</strong> discount or waive shipping costs. Each type has its own qualifier conditions and discount configuration." },
          { type: "callout", callout: "info", title: "Promotion Exclusivity", text: "Promotions can be set to Exclusive (only one applies), Class-exclusive (only one per class applies), or Non-exclusive (all matching promotions stack). Exclusive promotions are evaluated first; the highest-value one wins." },
          { type: "heading", text: "Qualifiers" },
          { type: "p", text: "A qualifier defines the condition a basket must meet for a promotion to fire: a minimum order amount, a specific product in the basket, a coupon code entry, a customer group membership, or a source code parameter in the URL. Multiple qualifiers can be combined with AND/OR logic." },
          { type: "callout", callout: "warning", title: "Performance Impact", text: "Complex promotions with many qualifiers significantly slow down basket recalculation. Every add-to-cart, quantity change, and coupon entry triggers a full promotion evaluation. Coordinate with merchandising to keep promotion rules lean." },
          { type: "heading", text: "Coupons" },
          { type: "p", text: "Coupons are standalone codes linked to a promotion via a coupon qualifier. They can be <strong>single-use</strong> (one redemption total), <strong>single-use per customer</strong>, or <strong>multi-use</strong>. Coupon codes can be imported in bulk via the Data API or Business Manager import." },
          { type: "heading", text: "Reading Promotions in Code" },
          { type: "p", text: "Use <code>dw.campaign.PromotionMgr</code> to retrieve active promotions for a product or basket. The <code>getActivePromotions()</code> method returns all currently applicable promotions. <code>getProductPromotions(product)</code> returns promotions that could fire for a specific product." },
        ],
        code: [
          {
            title: "Reading active promotions for a product",
            lang: "javascript",
            code: `'use strict';

var PromotionMgr = require('dw/campaign/PromotionMgr');
var ProductMgr = require('dw/catalog/ProductMgr');

function getProductBadges(pid) {
    var product = ProductMgr.getProduct(pid);
    if (!product) return [];

    // Get all promotions currently applicable to this product
    var promotions = PromotionMgr.getActivePromotions().getProductPromotions(product);

    var badges = [];
    var promotionIterator = promotions.iterator();

    while (promotionIterator.hasNext()) {
        var promo = promotionIterator.next();

        badges.push({
            id: promo.ID,
            name: promo.name,
            calloutMsg: promo.calloutMsg ? promo.calloutMsg.markup : null,
            rank: promo.rank
        });
    }

    // Sort by rank (lower rank = higher priority)
    return badges.sort(function (a, b) { return a.rank - b.rank; });
}`,
            explanation: "PromotionMgr.getActivePromotions() is context-aware — it checks the current date, customer group, and source codes. Always call it at request time, not during job execution."
          },
          {
            title: "Applying a coupon to a basket",
            lang: "javascript",
            code: `'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');

server.post('AddCoupon', server.middleware.https, function (req, res, next) {
    var couponCode = req.form.couponCode.trim().toUpperCase();
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.json({ error: true, errorMessage: 'No active basket' });
        return next();
    }

    // Validate coupon exists and is applicable
    var couponLineItem;
    Transaction.wrap(function () {
        couponLineItem = currentBasket.createCouponLineItem(couponCode, true);
    });

    if (!couponLineItem || !couponLineItem.applied) {
        res.json({
            error: true,
            errorMessage: 'Coupon code is invalid or has already been used.'
        });
        return next();
    }

    res.json({
        success: true,
        discount: couponLineItem.priceAdjustments
            .toArray()
            .reduce(function (sum, pa) { return sum + pa.price; }, 0)
    });

    return next();
});`,
            explanation: "createCouponLineItem(code, true) adds the coupon and triggers promotion recalculation. The second param (true) means merge with existing coupons. Check couponLineItem.applied to confirm it fired."
          },
          {
            title: "Promotion callout messages in ISML",
            lang: "xml",
            code: `<!--- Display promotion badge on product tile --->
<isif condition="\${pdict.product.promotions && pdict.product.promotions.length > 0}">
    <div class="promotion-badges">
        <isloop items="\${pdict.product.promotions}" var="promo">
            <isif condition="\${promo.calloutMsg}">
                <span class="promo-badge">
                    <!--- calloutMsg.markup is pre-rendered HTML from BM --->
                    <isprint value="\${promo.calloutMsg.markup}" encoding="off"/>
                </span>
            </isif>
        </isloop>
    </div>
</isif>`,
            explanation: "promo.calloutMsg.markup comes from the Callout Message field in Business Manager. Use encoding='off' because BM stores it as HTML — but only expose it if set by your own merchandisers."
          }
        ],
        quiz: [
          {
            q: "What is the correct hierarchy of B2C Commerce promotions?",
            options: [
              "Promotion → Campaign → Experience",
              "Campaign → Experience → Promotion",
              "Experience → Promotion → Campaign",
              "Campaign → Promotion → Coupon"
            ],
            correct: 1,
            explanation: "The hierarchy is Campaign (date range, customer group) → Experience (segment within campaign) → Promotion (the actual discount rule). A campaign can have multiple experiences, each with multiple promotions."
          },
          {
            q: "What does setting a promotion to 'Exclusive' mean?",
            options: [
              "It applies to exclusive (VIP) customers only",
              "Only one exclusive promotion can apply — the highest-value one wins",
              "It cannot be combined with coupons",
              "It runs before all non-exclusive promotions but stacks with them"
            ],
            correct: 1,
            explanation: "An Exclusive promotion means only one promotion with that exclusivity class can apply. When multiple exclusive promotions match, the highest-value one is applied and the rest are ignored."
          },
          {
            q: "Why do complex promotion rules hurt performance?",
            options: [
              "They require more database storage",
              "Every basket mutation (add to cart, qty change, coupon entry) triggers a full promotion re-evaluation",
              "They disable CDN caching for the entire site",
              "They require a separate microservice call"
            ],
            correct: 1,
            explanation: "Promotion evaluation runs synchronously on every basket change. With many complex promotions and qualifiers, this recalculation becomes the slowest part of add-to-cart and checkout flows."
          },
          {
            q: "What does createCouponLineItem(code, true) return if the coupon is invalid?",
            options: [
              "It throws a CouponException",
              "It returns a couponLineItem where couponLineItem.applied is false",
              "It returns null",
              "It returns an error code string"
            ],
            correct: 1,
            explanation: "createCouponLineItem() always returns a line item object but you must check .applied to confirm the coupon actually fired. An invalid or expired coupon creates the line item but does not apply a discount."
          }
        ]
      }
    ]
  },

  // ── MODULE 11 ─────────────────────────────────────────────────────────────
  {
    id: "search-content",
    title: "Search, Content & Page Designer",
    icon: "🔍",
    color: "#0891b2",
    type: "b2c",
    description: "Product search, search refinements, Einstein search, content assets, and Page Designer components.",
    lessons: [
      {
        id: "product-search",
        title: "Product Search & Refinements",
        duration: "9 min",
        type: "b2c",
        concept: [
          { type: "p", text: "B2C Commerce uses a built-in search engine (Elasticsearch-backed) configured entirely in Business Manager. No direct Elasticsearch access is provided — all configuration is done through the search index settings, search refinements, sorting rules, and search tuning tools in BM." },
          { type: "heading", text: "Search Index" },
          { type: "p", text: "Products are indexed automatically on a schedule or manually via <strong>Administration > Search > Search Indexes</strong>. The index captures product attributes, categories, prices, inventory, and custom attributes. Only attributes marked as <strong>searchable</strong> or <strong>used in search refinement</strong> in the System Object Type definition are indexed." },
          { type: "callout", callout: "info", title: "Index Rebuild Time", text: "Full index rebuilds can take minutes on large catalogs. Use delta index updates (only changed products) for frequent updates. Rebuilds are triggered by catalog imports and can be scheduled as a job step using the built-in SearchIndex step type." },
          { type: "heading", text: "Search Refinements" },
          { type: "p", text: "Refinements are the filter facets shown on search results and category pages (size, color, price range, brand). They are configured per-category in Business Manager. There are three types: <strong>attribute refinements</strong> (product attribute values), <strong>category refinements</strong> (sub-category drill-down), and <strong>price refinements</strong> (price range buckets)." },
          { type: "heading", text: "ProductSearchModel in Code" },
          { type: "p", text: "The <code>dw.catalog.ProductSearchModel</code> API executes search queries programmatically. You set the search phrase, category, refinement values, sorting rule, and pagination, then call <code>search()</code> to execute. The model returns a <code>ProductSearchResult</code> with hits, refinements, and pagination data." },
          { type: "callout", callout: "tip", title: "Einstein Search", text: "Einstein Search (available as an add-on) replaces the keyword ranking algorithm with ML-based personalised ranking. It also powers Search Suggestions (SAYT — Search As You Type) with instant results. No code changes are needed to enable it — it's configured in BM." },
        ],
        code: [
          {
            title: "ProductSearchModel — programmatic search",
            lang: "javascript",
            code: `'use strict';

var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var URLUtils = require('dw/web/URLUtils');

function executeSearch(params) {
    var apiProductSearch = new ProductSearchModel();

    // Set search phrase (keyword)
    if (params.q) {
        apiProductSearch.setSearchPhrase(params.q);
    }

    // Set category context
    if (params.cgid) {
        var category = CatalogMgr.getCategory(params.cgid);
        if (category && category.online) {
            apiProductSearch.setCategoryID(params.cgid);
        }
    }

    // Apply refinement values (e.g. color=blue&size=M)
    if (params.prefn1 && params.prefv1) {
        apiProductSearch.addRefinementValues(params.prefn1, params.prefv1);
    }

    // Sorting rule (configured in BM under Sorting Rules)
    if (params.srule) {
        apiProductSearch.setSortingRuleID(params.srule);
    }

    // Pagination
    var pageSize = 24;
    var start = params.start ? parseInt(params.start, 10) : 0;
    apiProductSearch.setPageSize(pageSize);
    apiProductSearch.setPageNumber(Math.floor(start / pageSize));

    // Execute the search
    apiProductSearch.search();

    return {
        productIds: apiProductSearch.getProductIDs().toArray(),
        count: apiProductSearch.getCount(),
        refinements: apiProductSearch.getRefinements(),
        currentSortingRule: apiProductSearch.getSortingRule()
    };
}`,
            explanation: "ProductSearchModel builds a query incrementally. Always call search() before accessing results. Refinement params follow the convention prefn1/prefv1, prefn2/prefv2, etc."
          },
          {
            title: "Rebuilding the search index as a job step",
            lang: "json",
            code: `// Business Manager: Administration > Operations > Jobs
// Add a job step of type: sitegenesis.search.SearchIndex
// (or use the built-in SearchIndex step)

// Job step parameters:
{
  "IndexType": "ProductIndex",    // ProductIndex | ContentIndex
  "Mode": "Full",                 // Full | Delta
  "SiteName": "RefArch",
  "Locale": "default"
}

// Recommended job schedule:
// Full rebuild: nightly (off-peak hours)
// Delta update: every 15 minutes during business hours`,
            explanation: "Full rebuilds are expensive — schedule them nightly. Delta updates only re-index changed products and run much faster, keeping search results fresh throughout the day."
          }
        ],
        quiz: [
          {
            q: "Which Business Manager area configures search refinements (filter facets)?",
            options: [
              "Merchant Tools > Search > Refinements",
              "Category management — per-category refinement configuration under the category settings",
              "Administration > Search > Refinements",
              "Merchant Tools > Products > Attributes"
            ],
            correct: 1,
            explanation: "Search refinements are configured per-category in the category management area of Merchant Tools. Each category can have its own set of attribute, category, and price refinements."
          },
          {
            q: "What must be done before a product attribute appears as a search refinement?",
            options: [
              "The attribute must be added to the catalog XML",
              "The attribute must be marked 'used in search refinement' in System Object Types and the index rebuilt",
              "The attribute must have a display name in all locales",
              "The attribute must be set to required"
            ],
            correct: 1,
            explanation: "Attributes must be flagged as searchable or used-in-refinement in System Object Type definitions. After that, a search index rebuild is required before the attribute appears in refinements."
          },
          {
            q: "What is a delta index update vs a full index rebuild?",
            options: [
              "Delta updates only index new products; full rebuilds index all products",
              "Delta updates only re-index products changed since the last build; full rebuilds re-index everything",
              "They are the same — 'delta' is just a faster rebuild mode",
              "Delta updates require a SCAPI call; full rebuilds use Business Manager"
            ],
            correct: 1,
            explanation: "Delta updates re-index only changed products, making them much faster and suitable for frequent scheduling. Full rebuilds re-index the entire catalog and are typically scheduled nightly."
          }
        ]
      },
      {
        id: "page-designer",
        title: "Page Designer & Content Assets",
        duration: "8 min",
        type: "b2c",
        concept: [
          { type: "p", text: "<strong>Page Designer</strong> is B2C Commerce's visual content management tool that lets merchandisers build and edit storefront pages without developer involvement. Developers create <strong>component types</strong> (JSON metadata + rendering templates); merchandisers assemble pages from those components in a drag-and-drop editor." },
          { type: "heading", text: "Three Core Concepts" },
          { type: "p", text: "<strong>Pages</strong> are top-level containers with metadata, regions, and route definitions (e.g. <code>/sale</code> or <code>/product/:productId</code>). <strong>Regions</strong> are named slots within a page or component where child components can be placed. <strong>Components</strong> are the reusable building blocks — either leaf components (render actual content) or layout components (contain regions)." },
          { type: "callout", callout: "info", title: "Headless Page Designer", text: "For PWA Kit / headless storefronts, add arch_type: 'headless' to all metadata files. This disables ISML rendering and uses React components instead, eliminating the need to maintain parallel ISML and React implementations." },
          { type: "heading", text: "Content Assets" },
          { type: "p", text: "<strong>Content Assets</strong> are reusable HTML fragments managed in Business Manager under <strong>Merchant Tools > Content > Content Assets</strong>. They are referenced in ISML via <code>ContentMgr.getContent('content-asset-id')</code> and rendered with <code>&lt;isprint value='${ca.custom.body.markup}' encoding='off'/&gt;</code>. Common uses: promotional banners, legal copy, FAQ content." },
          { type: "callout", callout: "tip", title: "Content Slots", text: "Content Slots are placeholders in templates where merchandisers can schedule content to appear. They differ from Content Assets in that slots support scheduling (show content A from Monday to Friday, then content B), A/B testing, and customer group targeting." },
        ],
        code: [
          {
            title: "Page Designer component metadata (JSON)",
            lang: "json",
            code: `{
  "name": "Hero Banner",
  "id": "hero_banner",
  "description": "Full-width hero image with headline and CTA",
  "group": "Banners",
  "attribute_definition_groups": [
    {
      "id": "content",
      "name": "Content",
      "attribute_definitions": [
        {
          "id": "heading",
          "name": "Heading Text",
          "type": "string",
          "required": true,
          "defaultValue": "Shop New Arrivals"
        },
        {
          "id": "backgroundImage",
          "name": "Background Image",
          "type": "image",
          "required": true
        },
        {
          "id": "ctaLink",
          "name": "CTA URL",
          "type": "url",
          "required": false
        },
        {
          "id": "ctaLabel",
          "name": "CTA Label",
          "type": "string",
          "defaultValue": "Shop Now"
        }
      ]
    }
  ]
}`,
            explanation: "Component JSON defines the fields merchandisers see in the Page Designer editor. Attribute types: string, text, integer, boolean, image, url, category, product, enum."
          },
          {
            title: "Page Designer component ISML template",
            lang: "xml",
            code: `<!--- templates/default/experience/components/banners/heroBanner.isml --->
<isscript>
    var assets = require('*/cartridge/scripts/assets.js');
    assets.addCss('/css/components/hero-banner.css');

    // Content is passed via pdict.content (the component's attribute values)
    var content = pdict.content;
</isscript>

<div class="hero-banner" role="banner">
    <isif condition="\${content.backgroundImage}">
        <img class="hero-banner__image"
             src="\${content.backgroundImage.absURL}"
             alt="<isprint value='\${content.heading}' encoding='htmlcontent'/>"
        />
    </isif>

    <div class="hero-banner__content">
        <h1 class="hero-banner__heading">
            <isprint value="\${content.heading}" encoding="htmlcontent"/>
        </h1>

        <isif condition="\${content.ctaLink}">
            <a class="hero-banner__cta btn btn-primary"
               href="\${content.ctaLink}">
                <isprint value="\${content.ctaLabel}" encoding="htmlcontent"/>
            </a>
        </isif>
    </div>
</div>`,
            explanation: "pdict.content contains the component's attribute values from Page Designer. File path must match: experience/components/{group}/{id}.isml."
          },
          {
            title: "Reading a Content Asset in a controller",
            lang: "javascript",
            code: `var ContentMgr = require('dw/content/ContentMgr');

function getPromoContent(contentId) {
    var contentAsset = ContentMgr.getContent(contentId);

    if (!contentAsset || !contentAsset.online) {
        return null;
    }

    return {
        id: contentAsset.ID,
        name: contentAsset.name,
        // custom.body is the HTML body field in BM
        body: contentAsset.custom.body ? contentAsset.custom.body.markup : ''
    };
}

// In ISML: render the body HTML
// <isprint value="\${pdict.promoContent.body}" encoding="off"/>
// (encoding='off' because it's trusted HTML from BM, not user input)`,
            explanation: "ContentMgr.getContent() retrieves a content asset by its ID. Always check .online before rendering. Use encoding='off' for body markup since it's authored in Business Manager."
          }
        ],
        quiz: [
          {
            q: "What is the difference between a Content Asset and a Content Slot?",
            options: [
              "They are the same — just different names",
              "Content Assets are static reusable HTML fragments; Content Slots support scheduling, A/B testing, and customer group targeting",
              "Content Slots are used in ISML; Content Assets are used in Page Designer only",
              "Content Assets are for images; Content Slots are for text"
            ],
            correct: 1,
            explanation: "Content Assets are static reusable HTML fragments. Content Slots are dynamic placeholders that support scheduling (show different content at different times), customer group targeting, and A/B testing."
          },
          {
            q: "What does arch_type: 'headless' do in a Page Designer metadata file?",
            options: [
              "Disables the component in Business Manager",
              "Disables ISML rendering and uses React components, removing the need for parallel ISML templates",
              "Marks the component as a layout (container) type",
              "Enables server-side rendering for the component"
            ],
            correct: 1,
            explanation: "arch_type: 'headless' tells Page Designer to use React rendering (for PWA Kit storefronts) instead of ISML. This eliminates the need to maintain both ISML and React templates."
          },
          {
            q: "In Page Designer, what is a 'Region'?",
            options: [
              "A geographic region for content localisation",
              "A named slot within a page or layout component where child components can be dropped",
              "A category of components in the component library",
              "A scheduled time window for content display"
            ],
            correct: 1,
            explanation: "Regions are named container slots within pages or layout components. Merchandisers drag components into regions in the visual editor. Developers define which regions exist in the page/component JSON metadata."
          }
        ]
      }
    ]
  },

  // ── MODULE 12 ─────────────────────────────────────────────────────────────
  {
    id: "localization-multisite",
    title: "Localization & Multi-Site",
    icon: "🌍",
    color: "#059669",
    type: "b2c",
    description: "Locale hierarchy, resource bundles, multi-currency, URL patterns, and multi-site architecture.",
    lessons: [
      {
        id: "localization",
        title: "Locale Hierarchy & Resource Bundles",
        duration: "8 min",
        type: "b2c",
        concept: [
          { type: "p", text: "B2C Commerce organises sites hierarchically: one <strong>Organization</strong> contains multiple <strong>Sites</strong>, each with its own locale configuration. Locale IDs follow the pattern <code>language_COUNTRY</code> (e.g. <code>en_US</code>, <code>de_DE</code>, <code>fr_CA</code>). Country codes must be ISO 3166-1-alpha-2 (two characters) — using 3-letter codes will cause order export failures." },
          { type: "heading", text: "Locale Fallback" },
          { type: "p", text: "The fallback chain is: <strong>country-specific locale</strong> (en_US) → <strong>language locale</strong> (en) → <strong>default locale</strong>. If a translation is missing in <code>en_US</code>, it automatically inherits from <code>en</code>, then from default. This hierarchy is configurable per-locale in BM and can be disabled." },
          { type: "callout", callout: "info", title: "Currency Handling", text: "Currency is automatically selected based on the active locale. USD displays as '$'; other currencies use prefixed symbols (e.g. 'A$' for AUD). The system includes all world currencies — no manual addition needed. Multi-currency display (showing prices in multiple currencies) is for display only and does not support multi-currency checkout." },
          { type: "heading", text: "Resource Bundles" },
          { type: "p", text: "The recommended approach is <strong>single template set with resource bundles</strong>. Externalize all user-facing strings into <code>.properties</code> files (one per locale), reference them via keys in templates using <code>Resource.msg('key', 'bundle', null)</code>. This is far more maintainable than maintaining separate template directories per locale." },
          { type: "callout", callout: "warning", title: "Encoding", text: "Properties files must be UTF-8 encoded. Files using ISO-8859-1 with extended ASCII characters (accented letters, etc.) must be converted. UTF-8 is required for Asian languages, Arabic, Hebrew, Cyrillic, and other non-Latin scripts." },
          { type: "heading", text: "URL Localisation" },
          { type: "p", text: "Standard localised URL structure: <code>/on/demandware.store/Sites-MySite-Site/{locale}/Home-Show</code>. When the locale is configured as the first URL element (e.g. <code>/en_US/mens</code>), requests without the locale prefix (<code>/mens</code>) will NOT resolve — the locale must always be present." },
        ],
        code: [
          {
            title: "Resource bundles structure and usage",
            lang: "text",
            code: `// Folder structure in your cartridge:
cartridge/templates/resources/
├── account.properties         ← default (en fallback)
├── account_de.properties      ← German
├── account_de_DE.properties   ← German (Germany) — more specific
├── account_fr.properties      ← French
└── account_fr_CA.properties   ← French (Canada)

// account.properties (default):
account.heading=My Account
account.welcome=Welcome, {0}!
account.orders.empty=You have no orders yet.

// account_de.properties:
account.heading=Mein Konto
account.welcome=Willkommen, {0}!
account.orders.empty=Sie haben noch keine Bestellungen.`,
            explanation: "Properties files follow the locale fallback chain. The {0} placeholder is replaced at runtime. Only override keys that differ from the parent locale — inherited keys auto-fallback."
          },
          {
            title: "Using Resource.msg() in controllers and ISML",
            lang: "javascript",
            code: `// In a controller (server-side JS):
var Resource = require('dw/web/Resource');

// Resource.msg(key, bundle, defaultValue, ...formatArgs)
var heading = Resource.msg('account.heading', 'account', 'My Account');
var welcome = Resource.msgf('account.welcome', 'account', null, customer.firstName);
// msgf() accepts format arguments for {0}, {1} placeholders

res.render('account/dashboard', {
    heading: heading,
    welcomeMsg: welcome
});`,
            explanation: "Resource.msg() uses the current request locale automatically. The bundle name matches the .properties filename (without locale suffix and .properties extension)."
          },
          {
            title: "ISML resource bundle usage",
            lang: "xml",
            code: `<!--- In ISML templates, use Resource directly --->
<isscript>
    var Resource = require('dw/web/Resource');
</isscript>

<h1>\${Resource.msg('account.heading', 'account', 'My Account')}</h1>

<!--- Or use the shorthand syntax in ISML (imports Resource automatically) --->
<h2>\${Resource.msg('checkout.title', 'checkout', null)}</h2>

<!--- With format arguments (customer name substitution) --->
<p>\${Resource.msgf('account.welcome', 'account', null, pdict.customer.firstName)}</p>

<!--- Static files (CSS/JS) use locale folder fallback automatically --->
<!--- URL: /on/demandware.static/Sites-MySite-Site/de_DE/-/css/main.css --->
<!--- Falls back to /default/css/main.css if de_DE folder doesn't have it --->`,
            explanation: "ISML resolves the locale from the current session automatically. Static assets (CSS/JS/images) in locale-specific subdirectories of cartridge/static/ also fall back to /default/."
          },
          {
            title: "Multi-site configuration in Business Manager",
            lang: "text",
            code: `// Organization hierarchy:
Organization
├── Site: US-English  (locale: en_US, currency: USD)
├── Site: UK-English  (locale: en_GB, currency: GBP)
├── Site: Germany     (locale: de_DE, currency: EUR)
└── Site: France      (locale: fr_FR, currency: EUR)

// Each site shares the SAME:
//   - Master catalog (product data)
//   - Code version (cartridges)
//   - Organization-level promotions

// Each site has its OWN:
//   - Site catalog (categories, product assignments)
//   - Price books (per-currency pricing)
//   - Site preferences (feature flags, API keys)
//   - Content assets and slots
//   - Search index

// Business Manager: Administration > Sites > Manage Sites
// Each site has its own Cartridge Path, Locale, Currency settings`,
            explanation: "Multi-site is a first-class feature. All sites share one code version and master catalog, cutting maintenance overhead significantly. Site-specific content and pricing are isolated per site."
          }
        ],
        quiz: [
          {
            q: "What is the locale fallback order for a missing en_US translation?",
            options: [
              "en_US → default (skips en)",
              "en_US → en → default",
              "default → en → en_US",
              "en_US fails with a missing key error"
            ],
            correct: 1,
            explanation: "The fallback chain is: country-specific (en_US) → language (en) → default. If en_US doesn't have the key, it looks in en; if en doesn't have it, it uses the default locale."
          },
          {
            q: "Why must country codes be ISO 3166-1-alpha-2 (two characters) in B2C Commerce?",
            options: [
              "Performance reasons — two characters is faster to index",
              "Three-letter codes cause failures including order export failures",
              "It is only a convention, not a strict requirement",
              "Business Manager only has room to display two characters"
            ],
            correct: 1,
            explanation: "B2C Commerce mandates two-character ISO 3166-1-alpha-2 country codes. Using three-letter codes will cause feature failures, including order export failures."
          },
          {
            q: "What method do you use to get a translated string with a placeholder value (e.g. customer name)?",
            options: [
              "Resource.msg('key', 'bundle', null)",
              "Resource.msgf('key', 'bundle', null, value)",
              "Resource.format('key', value)",
              "Resource.translate('key', {name: value})"
            ],
            correct: 1,
            explanation: "Resource.msgf() is the formatted version of msg(). It accepts additional arguments that replace {0}, {1}, etc. placeholders in the properties file value."
          }
        ]
      }
    ]
  },

  // ── MODULE 13 ─────────────────────────────────────────────────────────────
  {
    id: "security-deployment",
    title: "Security & Deployment",
    icon: "🔐",
    color: "#374151",
    type: "b2c",
    description: "OCAPI/SCAPI auth, OAuth scopes, XSS prevention, CSRF protection, and CI/CD deployment patterns.",
    lessons: [
      {
        id: "api-security",
        title: "API Security: OAuth, SLAS & Scopes",
        duration: "9 min",
        type: "b2c",
        concept: [
          { type: "p", text: "B2C Commerce API security is built on <strong>OAuth 2.0</strong>. Two distinct auth systems exist: <strong>OCAPI</strong> (legacy) uses its own client ID + JWT/OAuth flow managed in Account Manager. <strong>SCAPI</strong> (modern) uses <strong>SLAS</strong> (Shopper Login and API Access Service) with OAuth 2.0 + PKCE for shoppers, and Client Credentials for server-to-server calls." },
          { type: "heading", text: "SLAS Client Types" },
          { type: "p", text: "<strong>Public clients</strong> (no secret — for PWA Kit, SFRA, mobile apps): use Authorization Code + PKCE flow. No secret is generated; the PKCE verifier proves identity. <strong>Private clients</strong> (secret-based — for BFF layers, server-to-server): use Client Credentials flow. Secrets must never be exposed in client-side code." },
          { type: "callout", callout: "warning", title: "Least Privilege", text: "Apply the principle of least privilege when provisioning API clients. Only assign the scopes the client actually needs. Overly-broad scopes (e.g. .rw on everything) increase the blast radius if a token is compromised." },
          { type: "heading", text: "OAuth Scopes" },
          { type: "p", text: "Scopes control which resources a token can access. Scopes ending in <code>.rw</code> grant read+write access; scopes without <code>.rw</code> are read-only. Administrators assign <strong>Allowed Scopes</strong> (maximum a client can ever request) and <strong>Default Scopes</strong> (what tokens get if not specified) in Account Manager. SLAS handles a maximum of 30 Custom Object scopes." },
          { type: "callout", callout: "info", title: "XSS Responsibility", text: "SCAPI returns stored data as-is — no HTML encoding or sanitisation is applied. You are responsible for encoding output when rendering API responses in HTML. Always use htmlcontent encoding in ISML or your framework's equivalent to prevent XSS." },
          { type: "heading", text: "CSRF Protection in SFRA" },
          { type: "p", text: "SFRA includes built-in CSRF protection via the <code>csrf</code> middleware. POST routes that modify state (add to cart, update account, checkout) must use <code>csrf.validateAjaxRequest</code> or <code>csrf.validateRequest</code>. CSRF tokens are generated per session and validated server-side on every state-changing POST." },
        ],
        code: [
          {
            title: "SLAS — getting a guest shopper token (PKCE flow)",
            lang: "javascript",
            code: `import { ShopperLogin } from 'commerce-sdk-isomorphic';

const shopperLogin = new ShopperLogin({
    clientId: 'my-public-client-id',      // public client — no secret
    organizationId: 'f_ecom_zzzz_prd',
    shortCode: 'kv7kzm78',
    siteId: 'RefArch'
});

// Step 1: Generate PKCE verifier and challenge
function generatePKCE() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256')
        .update(verifier).digest('base64url');
    return { verifier, challenge };
}

// Step 2: Get guest token using PKCE
async function getGuestToken() {
    const { verifier, challenge } = generatePKCE();

    const tokenResponse = await shopperLogin.getAccessToken({
        body: {
            grant_type: 'client_credentials',
            code_verifier: verifier,
            code_challenge: challenge,
            code_challenge_method: 'S256',
            channel_id: 'RefArch'
        }
    });

    return tokenResponse.access_token;
}`,
            explanation: "Public SLAS clients use PKCE — the code_verifier proves the client that initiated the flow is the same one completing it. Never use a client secret in browser-side code."
          },
          {
            title: "OCAPI Settings — authorising a client in Business Manager",
            lang: "json",
            code: `// Business Manager: Administration > Site Development > Open Commerce API Settings
// Add to the Site or Global OCAPI settings JSON:
{
  "_v": "23.2",
  "clients": [
    {
      "client_id": "my-integration-client-id",
      "resources": [
        {
          "resource_id": "/orders/*",
          "methods": ["get", "patch"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/customers/*",
          "methods": ["get"],
          "read_attributes": "(id,first_name,last_name,email)"
        }
      ]
    }
  ]
}`,
            explanation: "OCAPI authorisation is JSON-based. Each resource_id is a path pattern. read_attributes / write_attributes use glob syntax (**) for all or specific fields. Restrict to minimum required attributes."
          },
          {
            title: "CSRF protection in SFRA controllers",
            lang: "javascript",
            code: `'use strict';

var server = require('server');
var csrf = require('*/cartridge/scripts/middleware/csrf');

// AJAX POST — validates CSRF token in request header/body
server.post('SaveAddress', server.middleware.https,
    csrf.validateAjaxRequest,
    function (req, res, next) {
        // Only reaches here if CSRF token is valid
        var addressData = req.form;
        // ... save address logic ...
        res.json({ success: true });
        return next();
    }
);

// Full-page form POST — validates CSRF from hidden form field
server.post('UpdateProfile', server.middleware.https,
    csrf.validateRequest,
    function (req, res, next) {
        // req.form contains validated POST data
        res.redirect(URLUtils.url('Account-Show'));
        return next();
    }
);

// Generate CSRF token for a form (in controller sending the page):
server.get('EditProfile', function (req, res, next) {
    var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
    res.render('account/editProfile', {
        csrf: { token: csrfProtection.generateToken() }
    });
    return next();
});`,
            explanation: "csrf.validateAjaxRequest reads the CSRF token from the request header (X-CSRF-Token). csrf.validateRequest reads from the form field. Always generate a token server-side and include it in your form/AJAX headers."
          }
        ],
        quiz: [
          {
            q: "What is the difference between a SLAS public client and a private client?",
            options: [
              "Public clients have more permissions; private clients are restricted",
              "Public clients (no secret, use PKCE) are for browser/mobile apps; private clients (with secret) are for server-to-server calls",
              "Public clients use OCAPI; private clients use SCAPI",
              "They are identical — the distinction is deprecated"
            ],
            correct: 1,
            explanation: "Public SLAS clients have no secret and use PKCE to secure the auth flow — safe for browsers and mobile apps. Private clients have a generated secret for server-to-server (BFF) flows. Never put a private client secret in browser-side code."
          },
          {
            q: "SCAPI returns data without HTML encoding. What does this mean for developers?",
            options: [
              "Nothing — browsers handle XSS protection automatically",
              "Developers must apply context-appropriate output encoding when rendering API responses in HTML to prevent XSS",
              "Salesforce handles encoding server-side before responses reach developers",
              "Only applies to user-generated content, not product data"
            ],
            correct: 1,
            explanation: "SCAPI returns raw stored data. If a product name contains <script>...</script> (from a data import), rendering it unencoded in HTML would execute the script. Always encode output: htmlcontent in ISML, or your framework's escaping equivalent."
          },
          {
            q: "What does a scope ending in '.rw' grant?",
            options: [
              "Read-only access to write-optimised endpoints",
              "Read and write access to that resource",
              "Restricted write access (append-only)",
              "Access to the resource's raw database records"
            ],
            correct: 1,
            explanation: "OAuth scopes ending in .rw (read-write) grant both read and write access to a resource. Scopes without .rw are read-only. Always provision the minimum scopes needed."
          },
          {
            q: "What middleware protects AJAX POST routes from CSRF attacks in SFRA?",
            options: [
              "server.middleware.https",
              "userLoggedIn.validateLoggedIn",
              "csrf.validateAjaxRequest",
              "cache.applyDefaultCache"
            ],
            correct: 2,
            explanation: "csrf.validateAjaxRequest validates the CSRF token in the request header (X-CSRF-Token) for AJAX calls. csrf.validateRequest is used for full-page form POSTs that send the token as a hidden field."
          }
        ]
      },
      {
        id: "deployment",
        title: "Deployment & CI/CD",
        duration: "8 min",
        type: "b2c",
        concept: [
          { type: "p", text: "B2C Commerce uses a <strong>code version</strong> system for deployments. Multiple code versions can exist on an instance simultaneously; only one is active at a time. This enables zero-downtime deployments by uploading a new version, testing it, then activating it. The active code version is set in Business Manager under <strong>Administration > Code Deployment</strong>." },
          { type: "heading", text: "sfcc-ci CLI" },
          { type: "p", text: "<code>sfcc-ci</code> is the official Salesforce Commerce Cloud CLI for automating deployments. Key commands: <code>code:deploy</code> (upload a zip to a code version), <code>code:activate</code> (activate a code version), <code>job:run</code> (trigger a BM job), <code>data:upload</code> (upload import files). It uses OAuth 2.0 for authentication with Account Manager." },
          { type: "callout", callout: "info", title: "dw.json", text: "The dw.json file in your project root configures sfcc-ci for local development: hostname, username, password, code-version, and cartridge list. Never commit credentials to source control — use environment variables in CI/CD pipelines instead." },
          { type: "heading", text: "Deployment Pipeline" },
          { type: "p", text: "A typical CI/CD pipeline: <strong>1)</strong> Run linting + unit tests, <strong>2)</strong> Zip cartridges, <strong>3)</strong> Upload to sandbox/staging via sfcc-ci, <strong>4)</strong> Activate the code version, <strong>5)</strong> Run smoke tests / integration tests, <strong>6)</strong> If passed: replicate to production. Replication (staging → production) is done via Business Manager's Staging Replication module." },
          { type: "callout", callout: "warning", title: "Replication is One-Way", text: "Data replication from Staging to Production is destructive and one-way. Always confirm what is being replicated. A full replication will overwrite production data with staging data for the selected modules. Only replicate what has changed." },
        ],
        code: [
          {
            title: "sfcc-ci deployment pipeline (shell script)",
            lang: "bash",
            code: `#!/bin/bash
# CI/CD deployment script using sfcc-ci

# Authenticate with Account Manager (use env vars, never hardcode)
sfcc-ci auth:login \\
  --client-id "\${SFCC_CLIENT_ID}" \\
  --client-secret "\${SFCC_CLIENT_SECRET}"

# Zip all cartridges into a deployable archive
cd ./cartridges
zip -r ../build/cartridges.zip . -x "*.DS_Store" -x "node_modules/*"
cd ..

# Upload the zip to the target instance as a new code version
sfcc-ci code:deploy ./build/cartridges.zip \\
  --instance "\${SFCC_INSTANCE}" \\
  --version "\${CODE_VERSION}"

# Activate the new code version
sfcc-ci code:activate \\
  --version "\${CODE_VERSION}" \\
  --instance "\${SFCC_INSTANCE}"

# Trigger a post-deploy job (e.g. search index rebuild)
sfcc-ci job:run SearchIndex \\
  --instance "\${SFCC_INSTANCE}" \\
  --wait

echo "Deployment complete: \${CODE_VERSION} on \${SFCC_INSTANCE}"`,
            explanation: "Use environment variables for all credentials in CI/CD. --wait on job:run blocks until the job completes, enabling pipeline gates based on job outcome."
          },
          {
            title: "dw.json — local development config",
            lang: "json",
            code: `{
  "hostname": "dev01-na01-yourcompany.demandware.net",
  "username": "developer@yourcompany.com",
  "password": "your-sandbox-password",
  "code-version": "version1",
  "cartridge": [
    "app_custom_brand",
    "app_storefront_base",
    "modules"
  ]
}`,
            explanation: "dw.json is read by sfcc-ci and VS Code Prophet Debugger for local development. Add it to .gitignore — use dw.json.example with placeholder values in source control instead."
          }
        ],
        quiz: [
          {
            q: "What is a 'code version' in B2C Commerce?",
            options: [
              "A git tag on the SFCC repository",
              "A named snapshot of all cartridges on an instance; only one is active at a time",
              "A version number in package.json",
              "A Business Manager configuration export"
            ],
            correct: 1,
            explanation: "A code version is a named container for all cartridge code on an SFCC instance. Multiple versions can coexist; only one is active. This enables testing a new deployment before activating it."
          },
          {
            q: "Why should dw.json never be committed to source control?",
            options: [
              "It contains sandbox hostnames which are confidential",
              "It contains credentials (username/password) that would expose sandbox access",
              "sfcc-ci does not support dw.json in CI/CD pipelines",
              "It is auto-generated and changes on every deployment"
            ],
            correct: 1,
            explanation: "dw.json contains a plaintext username and password. Committing it would expose sandbox credentials to anyone with repository access. Use environment variables in CI/CD and add dw.json to .gitignore."
          },
          {
            q: "What does 'staging replication' do in B2C Commerce?",
            options: [
              "Copies code from development to staging",
              "Copies selected data modules (catalog, content, config) from staging to production — one-way and potentially destructive",
              "Backs up the production database to staging",
              "Synchronises code versions between all instances"
            ],
            correct: 1,
            explanation: "Staging replication copies selected data modules from staging to production. It is one-way (staging → production) and overwrites production data for the selected modules. Always review what you're replicating before executing."
          }
        ]
      }
    ]
  }
];

window.CURRICULUM = CURRICULUM;
