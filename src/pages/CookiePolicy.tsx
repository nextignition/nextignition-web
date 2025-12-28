import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-24">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-display md:text-hero font-display font-bold text-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                1. What Are Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                NextIgnition uses cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Keep you logged in to your account</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services and user experience</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze platform performance and usage patterns</li>
                <li>Enable certain features and functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                3. Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    3.1 Essential Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are necessary for the platform to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    3.2 Performance Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously. This helps us improve the way our platform works.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    3.3 Functionality Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies allow the platform to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    3.4 Targeting/Advertising Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies may be set through our platform by our advertising partners. They may be used to build a profile of your interests and show you relevant content on other sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                4. Third Party Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third party cookies to report usage statistics, deliver advertisements, and provide other services. These third parties may include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Analytics providers (e.g., Google Analytics)</li>
                <li>Advertising networks</li>
                <li>Social media platforms</li>
                <li>Payment processors</li>
                <li>Customer support tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                5. Managing Cookies
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    5.1 Browser Settings
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Most web browsers allow you to control cookies through their settings preferences. You can set your browser to refuse cookies or delete certain cookies. However, if you disable cookies, some features of our platform may not function properly.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    5.2 Cookie Preferences
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can manage your cookie preferences through your account settings on NextIgnition. This allows you to control which types of cookies we use, except for essential cookies which are required for the platform to function.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    5.3 Opt Out Links
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    For third party cookies, you may need to visit the relevant third party website to opt out. Common opt out pages include:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-2">
                    <li>Google Analytics: https://tools.google.com/dlpage/gaoptout</li>
                    <li>Network Advertising Initiative: http://www.networkadvertising.org/choices/</li>
                    <li>Digital Advertising Alliance: http://www.aboutads.info/choices/</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                6. Do Not Track Signals
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. We do not currently respond to DNT browser signals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                7. Cookie Duration
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    7.1 Session Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while using the platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    7.2 Persistent Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies remain on your device for a set period or until you delete them. They help us recognize you when you return to our platform and remember your preferences.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                8. Updates to This Cookie Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                9. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <p className="text-foreground font-medium mt-2">
                Email: privacy@nextignition.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default CookiePolicy;

