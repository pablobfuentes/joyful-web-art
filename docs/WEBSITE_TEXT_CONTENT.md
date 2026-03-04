# Website Text Content Inventory

**Last updated:** 2026-03-03  
**Source:** `src/config/app-registry.ts`  
**Editor:** All paths below are editable in Registry Editor at `/registry-editor` under the **Content** tab for each section.

This document lists every user-facing text variable in the app registry. Each path corresponds to a string leaf in `APP_REGISTRY`. Add or change copy only in `app-registry.ts` (or via Registry Editor); components must not hardcode these strings.

---

## nav (Navigation)

| Registry path | Description |
|---------------|-------------|
| `nav.logoText` | Brand name (e.g. KumiBox) |
| `nav.logoEmoji` | Optional emoji next to logo |
| `nav.announcementBar` | Top bar message |
| `nav.announcementBarEmoji` | Optional emoji for announcement |
| `nav.links[i].label` | Nav link label |
| `nav.links[i].href` | Nav link URL / hash |
| `nav.logIn.label` | Log in button text |
| `nav.logIn.href` | Log in link |
| `nav.getStarted.label` | Get started / register button text |
| `nav.getStarted.href` | Get started link |

---

## hero (Hero Section)

| Registry path | Description |
|---------------|-------------|
| `hero.badgeText` | Badge number or label |
| `hero.imageBadgeLeft` | Left image badge (e.g. "Directo de Seúl") |
| `hero.imageBadgeRight` | Right image badge (e.g. "⭐ 4.9/5") |
| `hero.rotatingQuotes["0"\|"1"\|"2"]` | Rotating quote strings |
| `hero.heading` | Main headline |
| `hero.description` | Subtext below headline |
| `hero.primaryCta.label` | Primary button label |
| `hero.primaryCta.href` | Primary button link |
| `hero.secondaryCta.label` | Secondary button label |
| `hero.secondaryCta.href` | Secondary button link |
| `hero.footer` | Footer line (e.g. cancel, shipping, contracts) |

---

## why (Why / Problem Section)

| Registry path | Description |
|---------------|-------------|
| `why.title` | Section title |
| `why.ctaButton` | CTA button text |
| `why.impactLine1` | First impact line |
| `why.impactLine2` | Second impact line |
| `why.cards["0"\|"1"\|"2"].beforeText` | Card intro line |
| `why.cards[*].frictionText` | Friction line |
| `why.cards[*].costText` | Cost line |

---

## compatibilityTest (Compatibility Test)

| Registry path | Description |
|---------------|-------------|
| `compatibilityTest.subtitle` | Subtitle (e.g. "Test de Compatibilidad") |
| `compatibilityTest.title` | Section title |
| `compatibilityTest.triggerLabel` | Button/label to open test |
| `compatibilityTest.questions[i]` | Each question string |
| `compatibilityTest.resultDermatologist` | Result text when dermatologist recommended |
| `compatibilityTest.resultGoodFit` | Result text when good fit |
| `compatibilityTest.ctaButton` | CTA after result |

---

## howItWorks (How It Works)

| Registry path | Description |
|---------------|-------------|
| `howItWorks.title` | Section title |
| `howItWorks.ctaButton.label` | CTA label (e.g. "Ve un ejemplo de rutina") |
| `howItWorks.ctaButton.href` | CTA link (e.g. #experience) |
| `howItWorks.steps[i].label` | Step label (e.g. Subscríbete) |
| `howItWorks.steps[i].title` | Step title |
| `howItWorks.steps[i].description` | Step description |

---

## whatYouReceive (What You Receive)

| Registry path | Description |
|---------------|-------------|
| `whatYouReceive.subtitle` | Subtitle |
| `whatYouReceive.subtitleBadgeEmoji` | Optional emoji (e.g. 📦) |
| `whatYouReceive.title` | Section title |
| `whatYouReceive.description` | Intro paragraph |
| `whatYouReceive.products[i].number` | Product number |
| `whatYouReceive.products[i].emoji` | Product emoji |
| `whatYouReceive.products[i].category` | Category name |
| `whatYouReceive.products[i].description` | Product description |

---

## pastEditions (Past Editions)

| Registry path | Description |
|---------------|-------------|
| `pastEditions.subtitleEmoji` | Subtitle emoji (e.g. 📚) |
| `pastEditions.subtitle` | Subtitle |
| `pastEditions.title` | Section title |
| `pastEditions.fallbackImage` | Fallback image URL when edition has no image or load fails |
| `pastEditions.editions[i].name` | Edition name |
| `pastEditions.editions[i].category` | Edition category |
| `pastEditions.editions[i].month` | Month label |
| `pastEditions.editions[i].image` | Edition image URL |

---

## experience (Experience / Timeline Section)

| Registry path | Description |
|---------------|-------------|
| `experience.subtitle` | Subtitle (e.g. "The Experience") |
| `experience.title` | Section title |
| `experience.topBody` | Top body paragraph |
| `experience.ctaButton.label` | Top CTA label (if used) |
| `experience.ctaButton.href` | Top CTA link |
| `experience.closing.overline` | Closing block overline |
| `experience.closing.title` | Closing title |
| `experience.closing.highlight` | Closing highlight phrase |
| `experience.closing.body` | Closing body text |
| `experience.closing.ctaLabel` | Bottom CTA label |
| `experience.closing.ctaHref` | Bottom CTA link |
| `experience.steps[i].number` | Step number |
| `experience.steps[i].title` | Step title |
| `experience.steps[i].description` | Step description |

---

## testimonials (Testimonials)

| Registry path | Description |
|---------------|-------------|
| `testimonials.subtitleEmoji` | Subtitle emoji (e.g. ⭐) |
| `testimonials.subtitle` | Subtitle |
| `testimonials.fallbackAvatar` | Fallback avatar image URL |
| `testimonials.people[i].name` | Person name |
| `testimonials.people[i].role` | Person role |
| `testimonials.people[i].email` | Person email (if shown) |
| `testimonials.people[i].quote` | Quote text |
| `testimonials.people[i].profile` | Profile image URL |

---

## pricing (Pricing Section)

| Registry path | Description |
|---------------|-------------|
| `pricing.subtitle` | Subtitle |
| `pricing.title` | Section title |
| `pricing.plans[i].id` | Plan id (e.g. gift, monthly, premium) |
| `pricing.plans[i].name` | Plan name |
| `pricing.plans[i].emoji` | Plan emoji |
| `pricing.plans[i].priceAmount` | Price string (e.g. $499) |
| `pricing.plans[i].pricePeriod` | Period (e.g. / mes) |
| `pricing.plans[i].description` | Plan description |
| `pricing.plans[i].features[j]` | Feature string |
| `pricing.plans[i].badge` | Badge text or null |
| `pricing.plans[i].ctaButton` | Plan CTA button text |
| `pricing.plans[i].accentColor` | Accent key (e.g. lavender, peach, mint) |
| `pricing.shippingLabel` | Shipping label |
| `pricing.shippingValue` | Shipping value |
| `pricing.commitmentLabel` | Commitment label |
| `pricing.commitmentValue` | Commitment value |

---

## faq (FAQ Section)

| Registry path | Description |
|---------------|-------------|
| `faq.subtitle` | Subtitle |
| `faq.title` | Section title |
| `faq.items[i].question` | Question text |
| `faq.items[i].answer` | Answer text |

---

## finalCta (Final CTA Section)

| Registry path | Description |
|---------------|-------------|
| `finalCta.title` | Section title |
| `finalCta.descriptionPrimary` | Primary description line |
| `finalCta.descriptionSecondary` | Secondary description line |
| `finalCta.ctaButton.label` | CTA button label |
| `finalCta.ctaButton.href` | CTA link |
| `finalCta.footer` | Footer line |

---

## footer (Footer)

| Registry path | Description |
|---------------|-------------|
| `footer.mission.title` | Mission title |
| `footer.mission.description` | Mission description |
| `footer.navigate.title` | Navigate column title |
| `footer.navigate.links[i].label` | Nav link label |
| `footer.navigate.links[i].href` | Nav link URL |
| `footer.connect.title` | Connect column title |
| `footer.connect.links[i].label` | Social link label |
| `footer.connect.links[i].href` | Social link URL |
| `footer.newsletter.title` | Newsletter title |
| `footer.newsletter.placeholder` | Email input placeholder |
| `footer.bottomBar.copyright` | Copyright text |
| `footer.bottomBar.links[i].label` | Legal link label |
| `footer.bottomBar.links[i].href` | Legal link URL |

---

## login (Login Page)

| Registry path | Description |
|---------------|-------------|
| `login.title` | Page title |
| `login.subtitle` | Subtitle |
| `login.emailLabel` | Email field label |
| `login.emailPlaceholder` | Email placeholder |
| `login.passwordLabel` | Password label |
| `login.passwordPlaceholder` | Password placeholder |
| `login.rememberMe` | Remember me label |
| `login.forgotPassword` | Forgot password link text |
| `login.forgotPasswordHref` | Forgot password URL |
| `login.submitButton` | Submit button text |
| `login.noAccountText` | No account text |
| `login.signUpLink` | Sign up link text |
| `login.signUpHref` | Sign up URL |
| `login.errorTitle` | Error title |
| `login.errorGeneric` | Generic error message |

---

## register (Register Page)

| Registry path | Description |
|---------------|-------------|
| `register.title` | Page title |
| `register.subtitle` | Subtitle |
| `register.nameLabel` | Name field label |
| `register.namePlaceholder` | Name placeholder |
| `register.emailLabel` | Email label |
| `register.emailPlaceholder` | Email placeholder |
| `register.passwordLabel` | Password label |
| `register.passwordPlaceholder` | Password placeholder |
| `register.confirmPasswordLabel` | Confirm password label |
| `register.confirmPasswordPlaceholder` | Confirm placeholder |
| `register.submitButton` | Submit button text |
| `register.submitLoading` | Loading state text |
| `register.alreadyHaveAccount` | Already have account text |
| `register.signInLink` | Sign in link text |
| `register.signInHref` | Sign in URL |
| `register.errorTitle` | Error title |
| `register.errorGeneric` | Generic error message |

---

## forgotPassword (Forgot Password Page)

| Registry path | Description |
|---------------|-------------|
| `forgotPassword.title` | Page title |
| `forgotPassword.subtitle` | Subtitle |
| `forgotPassword.emailLabel` | Email label |
| `forgotPassword.emailPlaceholder` | Email placeholder |
| `forgotPassword.submitButton` | Submit button text |
| `forgotPassword.submitLoading` | Loading text |
| `forgotPassword.rememberPassword` | Remember password text |
| `forgotPassword.signInLink` | Sign in link text |
| `forgotPassword.signInHref` | Sign in URL |
| `forgotPassword.successTitle` | Success title |
| `forgotPassword.successMessage` | Success message |
| `forgotPassword.backToLogin` | Back to login text |
| `forgotPassword.errorTitle` | Error title |
| `forgotPassword.errorGeneric` | Generic error message |

---

## resetPassword (Reset Password Page)

| Registry path | Description |
|---------------|-------------|
| `resetPassword.title` | Page title |
| `resetPassword.subtitle` | Subtitle |
| `resetPassword.newPasswordLabel` | New password label |
| `resetPassword.newPasswordPlaceholder` | Placeholder |
| `resetPassword.confirmPasswordLabel` | Confirm label |
| `resetPassword.confirmPasswordPlaceholder` | Placeholder |
| `resetPassword.submitButton` | Submit button text |
| `resetPassword.submitLoading` | Loading text |
| `resetPassword.backToLogin` | Back to login text |
| `resetPassword.backToLoginHref` | Back to login URL |
| `resetPassword.successTitle` | Success title |
| `resetPassword.successMessage` | Success message |
| `resetPassword.goToLogin` | Go to login text |
| `resetPassword.errorTitle` | Error title |
| `resetPassword.errorInvalidLink` | Invalid link error |
| `resetPassword.errorGeneric` | Generic error message |

---

## dashboard (Dashboard Page)

| Registry path | Description |
|---------------|-------------|
| `dashboard.welcomeTitle` | Welcome title |
| `dashboard.emailLabel` | Email label |
| `dashboard.nameLabel` | Name label |
| `dashboard.memberSinceLabel` | Member since label |
| `dashboard.subscriptionLabel` | Subscription label |
| `dashboard.subscriptionActive` | Active state text |
| `dashboard.subscriptionInactive` | Inactive state text |
| `dashboard.nextBoxLabel` | Next box label |
| `dashboard.accountInfoTitle` | Account info title |
| `dashboard.editProfileTitle` | Edit profile title |
| `dashboard.editProfileButton` | Edit profile button |
| `dashboard.profileNameLabel` | Display name label |
| `dashboard.profileNamePlaceholder` | Name placeholder |
| `dashboard.saveProfile` | Save button text |
| `dashboard.saveProfileLoading` | Saving state text |
| `dashboard.cancelEdit` | Cancel text |
| `dashboard.profileUpdatedSuccess` | Success message |
| `dashboard.profileUpdateError` | Error message |
| `dashboard.changePasswordLabel` | Change password label |
| `dashboard.changePasswordHref` | Change password URL |
| `dashboard.quickActionsTitle` | Quick actions title |
| `dashboard.orderHistoryTitle` | Order history title |
| `dashboard.orderHistoryDesc` | Order history description |
| `dashboard.subscriptionActionTitle` | Subscription action title |
| `dashboard.subscriptionActionDesc` | Subscription action description |
| `dashboard.settingsTitle` | Settings title |
| `dashboard.settingsDesc` | Settings description |
| `dashboard.notificationsTitle` | Notifications title |
| `dashboard.notificationsDesc` | Notifications description |
| `dashboard.logOut` | Log out text |
| `dashboard.backToHome` | Back to home text |

---

## checkout (Checkout Page)

| Registry path | Description |
|---------------|-------------|
| `checkout.title` | Page title |
| `checkout.subtitle` | Subtitle |
| `checkout.backLink` | Back link text |
| `checkout.orderSummary` | Order summary title |
| `checkout.contactTitle` | Contact section title |
| `checkout.nameLabel` | Name label |
| `checkout.namePlaceholder` | Name placeholder |
| `checkout.emailLabel` | Email label |
| `checkout.emailPlaceholder` | Email placeholder |
| `checkout.addressTitle` | Address section title |
| `checkout.addressLabel` | Address label |
| `checkout.addressPlaceholder` | Address placeholder |
| `checkout.cityLabel` | City label |
| `checkout.cityPlaceholder` | City placeholder |
| `checkout.stateLabel` | State label |
| `checkout.statePlaceholder` | State placeholder |
| `checkout.zipLabel` | Zip label |
| `checkout.zipPlaceholder` | Zip placeholder |
| `checkout.payButton` | Pay button text |
| `checkout.payButtonSaving` | Pay button loading text |
| `checkout.secureNote` | Secure payment note |
| `checkout.saveOrderError` | Save order error message |
| `checkout.stripeError` | Stripe error message |
| `checkout.successTitle` | Success title |
| `checkout.successMessage` | Success message |
| `checkout.cancelTitle` | Cancel title |
| `checkout.cancelMessage` | Cancel message |
| `checkout.cancelBackToCheckout` | Cancel back to checkout text |
| `checkout.cancelBackToPricing` | Cancel back to pricing text |
| `checkout.loginRequiredMessage` | Login required message |

---

## account (Account Page)

| Registry path | Description |
|---------------|-------------|
| `account.title` | Page title |
| `account.placeholder` | Placeholder / description |

---

## Notes

- **Single source of truth:** All user-facing strings live in `src/config/app-registry.ts`. Components use `getSectionContent(sectionKey)` and optional `getStyleForPath(pathKey, defaultCssVar)` from `RegistryContentContext`.
- **Registry Editor:** At `/registry-editor`, each section has a **Content** tab that lists every string path above; you can edit text, font, size, and color. Use **Preview** to apply in browser without saving files; use **Save** to write to `app-registry.ts` and reload.
- **Lists:** Sections with arrays (e.g. `nav.links`, `faq.items`, `pricing.plans`) are normalized in the UI via `registryListToArray()` so that both array and object-with-numeric-keys formats work; see `src/lib/utils.ts`.
