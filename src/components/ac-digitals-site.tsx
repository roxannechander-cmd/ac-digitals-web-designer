import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight, Building2, Check, ChevronRight, CircleCheck, Construction,
  Globe2, Menu, MessageCircle, MonitorSmartphone, Scissors, ShoppingBag,
  Sparkles, Store, UtensilsCrossed, Wrench, X, Zap,
} from "lucide-react";
import logoAsset from "@/assets/ac-digitals-logo.png.asset.json";
import { submitQuote, type QuoteInput } from "@/lib/quote.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const nav = [["Home", "top"], ["Services", "services"], ["Industries", "industries"], ["What You Get", "included"], ["Pricing", "pricing"], ["Portfolio", "portfolio"], ["FAQ", "faq"], ["Contact", "contact"]] as const;

const industries = [
  { icon: Store, title: "Auto Shops & Car Dealerships", text: "Inventory-led experiences with vehicle listings, finance enquiries and location-focused contact journeys.", tags: ["Vehicle listings", "Enquiry CTAs", "Inventory"] },
  { icon: Wrench, title: "Plumbers & Contractors", text: "Service-first websites with urgent contact actions, quote forms and clear service-area coverage.", tags: ["Quote forms", "Emergency CTAs", "Service areas"] },
  { icon: Building2, title: "Real Estate Businesses", text: "Refined property showcases built around listings, agent profiles and qualified lead generation.", tags: ["Listings", "Agent profiles", "Leads"] },
  { icon: UtensilsCrossed, title: "Restaurants", text: "Atmospheric digital experiences for menus, galleries, bookings, directions and direct enquiries.", tags: ["Menus", "Bookings", "Gallery"] },
  { icon: Scissors, title: "Salons & Barbers", text: "Style-forward websites presenting services, pricing, portfolios and effortless booking actions.", tags: ["Services", "Pricing", "Bookings"] },
  { icon: Construction, title: "Construction Companies", text: "Credibility-led company websites with project portfolios, capabilities and quote requests.", tags: ["Projects", "Services", "Quotes"] },
  { icon: ShoppingBag, title: "Online Stores", text: "Premium product experiences with catalogues, product pages and checkout integration where required.", tags: ["Products", "Shopping", "Promotions"] },
  { icon: Globe2, title: "Professional Businesses", text: "Confident corporate, consultancy and personal-brand websites engineered to win trust.", tags: ["Corporate", "Consultancy", "Lead generation"] },
];

const included = [
  ["Premium Custom Design", "Tailored to your business, brand, industry and target customer."],
  ["Mobile Responsive Design", "A polished experience across smartphones, tablets, laptops and desktops."],
  ["Lead Generation", "Strategic enquiry forms and calls-to-action that invite the next step."],
  ["Professional Presentation", "Showcase services, products, properties, menus and portfolios with clarity."],
  ["Contact & Enquiry Features", "Email, phone, WhatsApp and professional contact forms as required."],
  ["Social Media Integration", "Connect the social channels most relevant to your business."],
  ["SEO-Friendly Structure", "Clean, discoverable foundations built for search engines and people."],
  ["Fast & Modern Experience", "Focused layouts, smooth browsing and performance-minded execution."],
  ["Trust-Building Sections", "Make space for verified reviews, certifications, projects and credentials."],
  ["Clear Calls To Action", "Guide visitors to enquire, call, book, request a quote or shop."],
  ["Professional Structure", "Home, About, Services, Portfolio, FAQ, Contact and more as needed."],
  ["Scalable Design", "A strong digital foundation that can grow with your business."],
];

const portfolio = [
  { sector: "Automotive", name: "Blackline Motors", hue: "portfolio-red", metric: "Precision in motion" },
  { sector: "Hospitality", name: "Noir Table", hue: "portfolio-gold", metric: "Dining, reimagined" },
  { sector: "Real Estate", name: "North & Key", hue: "portfolio-blue", metric: "Property with presence" },
  { sector: "Construction", name: "Monolith Build", hue: "portfolio-silver", metric: "Built to endure" },
  { sector: "Beauty", name: "Atelier Hair", hue: "portfolio-rose", metric: "Modern self-care" },
  { sector: "E-commerce", name: "Form Supply", hue: "portfolio-green", metric: "Objects of distinction" },
];

const faqs = [
  ["How much does a website cost?", "Pricing starts from R2,000 for South African projects and international projects start from $500 / €500 / £500, depending on the project's requirements and complexity."],
  ["Do you work with businesses outside South Africa?", "Yes. AC DIGITALS is based in Durban, South Africa and works with clients internationally."],
  ["What types of businesses do you build websites for?", "AC DIGITALS works with auto businesses, dealerships, plumbers, contractors, real estate businesses, restaurants, salons, barbers, construction companies, online stores and professional businesses."],
  ["Will my website work on mobile phones?", "Yes. Websites are designed to be responsive across modern mobile, tablet and desktop devices."],
  ["Can my website include a contact form?", "Yes. Professional enquiry and contact forms can be included according to the project requirements."],
  ["Can I request a custom design?", "Yes. Website designs can be tailored to your business, branding, industry and target audience."],
  ["How do I get a quotation?", "Complete the enquiry form and provide information about your business and website requirements. AC DIGITALS will review the request and respond with the next steps."],
];

const businessTypes = ["Auto Shop", "Car Dealership", "Plumber", "Contractor", "Real Estate", "Restaurant", "Salon", "Barber", "Construction", "Online Store", "Professional Business", "Other"];
const needs = ["New Website", "Website Redesign", "Online Store", "Landing Page", "Business Website", "Portfolio Website", "Property Website", "Restaurant Website", "Other"];
const initialForm: QuoteInput = { fullName: "", businessName: "", email: "", phone: "", country: "", businessType: "", hasWebsite: false, currentWebsiteUrl: "", projectNeeds: [], pageCount: "", estimatedBudget: "", projectDetails: "", mainGoal: "", consent: false };

function jump(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

export function AcDigitalsSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<QuoteInput>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const sendQuote = useServerFn(submitQuote);
  const whatsapp = useMemo(() => "https://wa.me/27820675538?text=" + encodeURIComponent("Hello Aaron, I found AC DIGITALS online and would like to enquire about a website for my business."), []);

  const update = <K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  const toggleNeed = (need: string) => update("projectNeeds", form.projectNeeds.includes(need) ? form.projectNeeds.filter((item) => item !== need) : [...form.projectNeeds, need]);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    if (!form.businessType || !form.pageCount || !form.estimatedBudget || !form.mainGoal || form.projectNeeds.length === 0) { setError("Please complete all required selections."); return; }
    if (!form.consent) { setError("Please confirm that AC DIGITALS may contact you."); return; }
    setStatus("sending");
    try { await sendQuote({ data: form }); setStatus("success"); setForm(initialForm); }
    catch (err) { setStatus("error"); setError(err instanceof Error ? err.message : "Your enquiry could not be sent. Please try again."); }
  };

  return <div id="top" className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-20 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:px-10">
        <button aria-label="Go to top" onClick={() => jump("top")} className="flex min-w-0 items-center gap-3 text-left">
          <img src={logoAsset.url} alt="AC DIGITALS logo" className="h-12 w-12 shrink-0 rounded-sm object-cover" />
          <span className="min-w-0"><strong className="block truncate font-display text-lg font-semibold">AC DIGITALS</strong><small className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:block">Web design studio</small></span>
        </button>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main navigation">{nav.map(([label,id]) => <button key={id} onClick={() => jump(id)} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">{label}</button>)}<Button variant="luxury" size="lg" onClick={() => jump("quote")}>Get A Quote <ArrowRight /></Button></nav>
        <Button className="xl:hidden" variant="ghost" size="icon" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <div className="border-t border-border bg-background px-5 py-5 xl:hidden"><nav className="grid gap-1">{nav.map(([label,id]) => <button key={id} onClick={() => { jump(id); setMenuOpen(false); }} className="rounded-md px-4 py-3 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{label}</button>)}<Button className="mt-3" variant="luxury" onClick={() => { jump("quote"); setMenuOpen(false); }}>Get A Quote <ArrowRight /></Button></nav></div>}
    </header>

    <main>
      <section className="hero-grid relative flex min-h-[94svh] items-center overflow-hidden border-b border-border px-5 pb-20 pt-32 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative z-10 max-w-4xl animate-fade-in">
            <p className="eyebrow"><span className="status-dot" /> Independent digital studio · Durban / Worldwide</p>
            <h1 className="mt-8 font-display text-[clamp(3.25rem,7vw,7.4rem)] font-medium leading-[0.91] tracking-normal">Your business deserves a website <span className="text-shimmer">that gets noticed.</span></h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">Premium, modern websites designed to make your business look professional, build trust and turn visitors into customers — serving businesses in South Africa and internationally.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button variant="luxury" size="xl" onClick={() => jump("quote")}>Get Your Free Website Quote <ArrowRight /></Button><Button variant="luxuryOutline" size="xl" onClick={() => jump("services")}>View Our Services <ChevronRight /></Button></div>
            <p className="mt-7 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground"><Globe2 className="h-4 w-4 text-accent" /> Based in Durban, South Africa <span className="text-border">•</span> Serving clients worldwide</p>
          </div>
          <div className="relative hidden min-h-[640px] lg:block" aria-label="Interactive website design preview">
            <div className="hero-orbit" /><div className="preview-window animate-float-slow"><div className="browser-bar"><span/><span/><span/><em>ac-digital.studio</em></div><div className="preview-body"><div className="preview-kicker">EXCEPTIONAL DIGITAL PRESENCE</div><div className="preview-title">Form meets<br/><i>function.</i></div><div className="preview-rule"/><div className="preview-stats"><span>01<br/><small>Strategy</small></span><span>02<br/><small>Design</small></span><span>03<br/><small>Launch</small></span></div></div></div>
            <div className="floating-card card-performance"><Zap/><span><b>Fast by design</b><small>Performance focused</small></span></div>
            <div className="floating-card card-responsive"><MonitorSmartphone/><span><b>Every screen</b><small>Responsive precision</small></span></div>
            <div className="cursor-detail"><span>AC</span></div>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-secondary/40"><div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-border md:grid-cols-5">{["Modern Design", "Mobile Optimised", "Built For Your Business", "International Clients", "Conversion Focused"].map((item) => <div key={item} className="flex min-h-24 items-center justify-center gap-2 border-b border-border px-4 text-center text-[11px] font-semibold uppercase tracking-[0.13em] last:col-span-2 md:border-b-0 md:last:col-span-1"><Check className="h-3.5 w-3.5 text-accent" />{item}</div>)}</div></div>

      <section id="services" className="section-shell"><div className="section-heading"><p className="eyebrow">Signature services</p><h2>More than a website.<br/><span>An advantage.</span></h2><p>Strategy, design and development brought together to give ambitious businesses a digital presence worthy of their work.</p></div><div className="mt-16 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">{[["01", "Website Design", "Bespoke visual systems and page experiences built around your brand, audience and commercial goals."],["02", "Website Redesign", "Transform an outdated or underperforming website into a sharper, more credible business asset."],["03", "Online Experiences", "Landing pages, portfolios, property showcases and online stores tailored to project requirements."]].map(([n,t,d]) => <article key={n} className="service-panel group"><span>{n}</span><h3>{t}</h3><p>{d}</p><button onClick={() => jump("quote")}>Start a conversation <ArrowRight/></button></article>)}</div></section>

      <section id="industries" className="section-shell border-y border-border bg-secondary/25"><div className="section-heading"><p className="eyebrow">Industry expertise</p><h2>Websites built around<br/><span>your industry.</span></h2><p>Your website should reflect the quality of the business behind it. Every experience is tailored around your customers, context and goals.</p></div><div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{industries.map(({icon: Icon,title,text,tags},i) => <article key={title} className="industry-card group"><div className="flex items-start justify-between"><span className="icon-box"><Icon/></span><span className="text-xs text-muted-foreground">0{i+1}</span></div><h3>{title}</h3><p>{text}</p><div className="mt-6 flex flex-wrap gap-2">{tags.map(tag => <span key={tag}>{tag}</span>)}</div><button onClick={() => jump("quote")}>Build my website <ArrowRight/></button></article>)}</div></section>

      <section id="included" className="section-shell"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div className="section-heading lg:sticky lg:top-28 lg:self-start"><p className="eyebrow">Built with intent</p><h2>Everything you need to launch <span>with confidence.</span></h2><p>AC DIGITALS doesn't simply create attractive pages. Each website is designed to create a credible, professional online presence.</p><div className="mt-8 note-line"><Sparkles/> Advanced functionality is available according to your chosen project scope.</div></div><div className="feature-list">{included.map(([title,text],i) => <article key={title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{text}</p></div><CircleCheck/></article>)}</div></div></section>

      <section id="pricing" className="section-shell pricing-band"><div className="section-heading centered"><p className="eyebrow">Investment</p><h2>Premium websites without<br/><span>agency-level complexity.</span></h2><p>Pricing is shaped by the size, functionality and requirements of your project—not by a one-size-fits-all package.</p></div><div className="mx-auto mt-14 grid max-w-5xl gap-4 lg:grid-cols-2"><article className="price-card price-featured"><div><p>South Africa</p><h3>R2,000 – R5,000 <small>ZAR</small></h3><span>For businesses needing a professional online presence.</span></div><Globe2/></article><article className="price-card"><div><p>International</p><h3>$500 – $5,000 <small>USD</small></h3><h3>€500 – €5,000 <small>EUR</small></h3><h3>£500 – £5,000 <small>GBP</small></h3><span>Scope varies by pages, functionality and integrations.</span></div><Globe2/></article></div><div className="mx-auto mt-8 max-w-3xl text-center"><p className="text-sm leading-7 text-muted-foreground">Every project is quoted according to the client's specific requirements. Contact AC DIGITALS for a personalised quotation.</p><Button className="mt-7" variant="luxury" size="xl" onClick={() => jump("quote")}>Request a Quote <ArrowRight/></Button></div></section>

      <section className="section-shell"><div className="section-heading"><p className="eyebrow">The difference</p><h2>Why businesses choose<br/><span>AC DIGITALS.</span></h2></div><div className="mt-14 border-t border-border">{[["01","Business-Focused Design","Designed around your business goals—not simply dressed in a generic template."],["02","Professional First Impressions","Your website is often the first interaction a potential customer has with your business. Make it count."],["03","Built For Modern Customers","Responsive layouts and clear navigation help customers find information and act."],["04","Conversion Mindset","Strategic actions and enquiry opportunities help turn attention into potential customers."],["05","Local Roots. Global Reach.","Based in Durban, South Africa and available to work with businesses internationally."]].map(([n,t,d]) => <article key={n} className="why-row"><span>{n}</span><h3>{t}</h3><p>{d}</p><ArrowRight/></article>)}</div></section>

      <section id="portfolio" className="section-shell border-y border-border bg-secondary/20"><div className="section-heading"><p className="eyebrow">Selected concepts</p><h2>Digital experiences designed<br/><span>to stand out.</span></h2><p>Concept explorations demonstrating the standard, range and visual direction AC DIGITALS can bring to your industry.</p></div><div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{portfolio.map((item) => <article className="portfolio-card group" key={item.name}><div className={`portfolio-screen ${item.hue}`}><div className="mini-browser"><span/><span/><span/></div><p>{item.sector}</p><h3>{item.name}</h3><em>{item.metric}</em><div className="mock-button">Discover <ArrowRight/></div></div><div className="flex items-center justify-between border-t border-border px-1 pt-4"><div><span>Concept Design</span><h4>{item.sector} website</h4></div><ArrowRight className="transition-transform group-hover:translate-x-1"/></div></article>)}</div></section>

      <section className="section-shell"><div className="section-heading centered"><p className="eyebrow">A clear process</p><h2>From first conversation<br/><span>to launch.</span></h2></div><div className="process-line mt-16 grid gap-10 md:grid-cols-4">{[["01","Tell Us About Your Business","Submit the enquiry form and tell us what you need."],["02","Discuss Your Requirements","We understand your audience, goals and requirements."],["03","Design & Build","Your website is crafted around your business."],["04","Launch","Once approved, your professional digital presence goes live."]].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

      <section className="testimonial-band"><div className="mx-auto max-w-4xl px-5 text-center"><p className="eyebrow justify-center">Client perspective</p><blockquote>“Great work deserves a digital presence that feels equally considered.”</blockquote><p>Client testimonials coming soon</p></div></section>

      <section id="faq" className="section-shell"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div className="section-heading"><p className="eyebrow">Questions, answered</p><h2>What you might<br/><span>want to know.</span></h2><p>Need clarity on something else? Speak directly with Aaron about your project.</p><Button className="mt-8" variant="luxuryOutline" onClick={() => jump("contact")}>Contact AC DIGITALS <ArrowRight/></Button></div><Accordion type="single" collapsible className="border-t border-border">{faqs.map(([q,a],i) => <AccordionItem key={q} value={`faq-${i}`} className="border-border"><AccordionTrigger className="py-6 text-base font-medium hover:no-underline md:text-lg"><span className="pr-4 text-left">{q}</span></AccordionTrigger><AccordionContent className="max-w-2xl pb-6 text-base leading-7 text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <section id="contact" className="final-cta"><div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-32"><div><p className="eyebrow">Your next chapter</p><h2>Ready to give your business a better <span>online presence?</span></h2><p>Tell us about your business and what you need. Let's create a website that looks as professional online as it does in the real world.</p><Button className="mt-8" variant="luxury" size="xl" onClick={() => jump("quote")}>Start Your Website Project <ArrowRight/></Button></div><div className="contact-panel"><p className="text-xs uppercase tracking-[0.2em] text-accent">Direct contact</p><h3>Aaron Chander<br/><span>AC DIGITALS</span></h3><div><small>WhatsApp & Calls Only</small><a href="tel:+27820675538">+27 82 067 5538</a></div><div><small>Email</small><a href="mailto:chandernejiv@gmail.com">chandernejiv@gmail.com</a></div><Button asChild variant="whatsapp"><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp Aaron</a></Button></div></div></section>

      <section id="quote" className="section-shell bg-secondary/25"><div className="mx-auto max-w-5xl"><div className="section-heading centered"><p className="eyebrow">Project enquiry</p><h2>Request your<br/><span>website quote.</span></h2><p>Tell us about your business and what you're looking for. More context helps us understand your project better.</p></div>
        {status === "success" ? <div className="success-panel"><CircleCheck/><h3>Thank you. Your enquiry has been received.</h3><p>AC DIGITALS will review your requirements and contact you using the details provided.</p><Button variant="luxuryOutline" onClick={() => setStatus("idle")}>Send another enquiry</Button></div> :
        <form onSubmit={submit} className="quote-form mt-14" noValidate>
          <div className="form-grid"><Field label="Full Name" required><Input required minLength={2} maxLength={100} autoComplete="name" value={form.fullName} onChange={e=>update("fullName",e.target.value)}/></Field><Field label="Business Name" required><Input required minLength={2} maxLength={120} autoComplete="organization" value={form.businessName} onChange={e=>update("businessName",e.target.value)}/></Field><Field label="Email Address" required><Input required type="email" maxLength={255} autoComplete="email" value={form.email} onChange={e=>update("email",e.target.value)}/></Field><Field label="WhatsApp / Phone Number" required><Input required type="tel" minLength={7} maxLength={40} autoComplete="tel" value={form.phone} onChange={e=>update("phone",e.target.value)}/></Field><Field label="Country" required><Input required minLength={2} maxLength={100} autoComplete="country-name" value={form.country} onChange={e=>update("country",e.target.value)}/></Field><Field label="Business Type" required><select required value={form.businessType} onChange={e=>update("businessType",e.target.value)}><option value="">Select your industry</option>{businessTypes.map(x=><option key={x}>{x}</option>)}</select></Field></div>
          <fieldset><legend>Do you already have a website? <b>*</b></legend><div className="choice-row">{([["Yes",true],["No",false]] as const).map(([label,value])=><label key={label} className={form.hasWebsite===value ? "active" : ""}><input type="radio" name="hasWebsite" checked={form.hasWebsite===value} onChange={()=>update("hasWebsite",value)}/>{label}</label>)}</div></fieldset>
          {form.hasWebsite && <Field label="Current Website URL (optional)"><Input type="url" maxLength={500} placeholder="https://" value={form.currentWebsiteUrl} onChange={e=>update("currentWebsiteUrl",e.target.value)}/></Field>}
          <fieldset><legend>What do you need? <b>*</b></legend><div className="check-grid">{needs.map(item=><label key={item}><Checkbox checked={form.projectNeeds.includes(item)} onCheckedChange={()=>toggleNeed(item)}/><span>{item}</span></label>)}</div></fieldset>
          <div className="form-grid"><Field label="How many pages do you need?" required><select required value={form.pageCount} onChange={e=>update("pageCount",e.target.value)}><option value="">Select</option>{["1–3","4–6","7–10","Not sure"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Estimated Budget" required><select required value={form.estimatedBudget} onChange={e=>update("estimatedBudget",e.target.value)}><option value="">Select</option>{["R2,000–R5,000 ZAR","$500–$1,000 USD","$1,000–$2,500 USD","$2,500–$5,000 USD","Not sure"].map(x=><option key={x}>{x}</option>)}</select></Field></div>
          <Field label="Tell us about your project" required><Textarea required minLength={20} maxLength={3000} rows={7} placeholder="What would you like the website to achieve? Share any pages, features or ideas you have in mind." value={form.projectDetails} onChange={e=>update("projectDetails",e.target.value)}/></Field>
          <Field label="What is your main goal for the website?" required><select required value={form.mainGoal} onChange={e=>update("mainGoal",e.target.value)}><option value="">Select the primary goal</option>{["Generate more enquiries","Get more customers","Showcase my business","Sell products online","Build credibility","Redesign an existing website","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
          <label className="consent"><Checkbox checked={form.consent} onCheckedChange={(checked)=>update("consent",checked===true)}/><span>I agree to be contacted by AC DIGITALS regarding my website enquiry.</span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button type="submit" variant="luxury" size="xl" disabled={status === "sending"}>{status === "sending" ? "Sending your enquiry…" : <>Request My Quote <ArrowRight/></>}</Button>
        </form>}
      </div></section>
    </main>

    <footer className="border-t border-border bg-card"><div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10"><div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.7fr]"><div><div className="flex items-center gap-3"><img src={logoAsset.url} alt="AC DIGITALS" className="h-16 w-16 rounded-sm object-cover"/><div><h2 className="font-display text-xl">AC DIGITALS</h2><p className="text-sm text-muted-foreground">Premium Websites. Powerful First Impressions.</p></div></div><p className="mt-6 text-sm text-muted-foreground">Durban, South Africa <span className="mx-2">•</span> Serving Clients Worldwide</p></div><div><h3>Explore</h3><div className="mt-4 grid grid-cols-2 gap-3">{nav.slice(0,7).map(([label,id])=><button className="text-left text-sm text-muted-foreground hover:text-foreground" onClick={()=>jump(id)} key={id}>{label}</button>)}</div></div><div><h3>Contact</h3><a href="tel:+27820675538">+27 82 067 5538</a><a href="mailto:chandernejiv@gmail.com">chandernejiv@gmail.com</a></div></div><div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 AC DIGITALS. All Rights Reserved.</span><span>Designed for first impressions that last.</span></div></div></footer>

    <div className="mobile-cta"><Button asChild variant="whatsapp"><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a></Button><Button variant="luxury" onClick={()=>jump("quote")}>Get A Quote <ArrowRight/></Button></div>
  </div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) { return <label className="field"><span>{label}{required && <b> *</b>}</span>{children}</label>; }