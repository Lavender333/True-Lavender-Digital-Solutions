import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { LogOut, Plus, Link as LinkIcon, Trash2, Calendar, Video, MessageSquare, CheckCircle2, User, Mail, Edit } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { format } from 'date-fns';

type TabType = 'meetings' | 'messages' | 'contracts' | 'trash';

const appUrl = (import.meta.env.VITE_APP_URL || 'https://thetruelavender.com').replace(/\/$/, '');

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('meetings');
  
  const [meetings, setMeetings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposedTimes, setProposedTimes] = useState<string[]>(['']);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');

  // Contract form state
  const [contractClientName, setContractClientName] = useState('');
  const [contractClientEmail, setContractClientEmail] = useState('');
  const [contractServiceName, setContractServiceName] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [contractTerms, setContractTerms] = useState('');

  const contractTemplates = [
    {
      id: 'web-build',
      name: 'Website Build',
      serviceName: 'Website Build & Strategy',
      amount: '$2,300.00',
      terms: 'WEBSITE DESIGN & DEVELOPMENT AGREEMENT\n\nThis Website Design & Development Agreement ("Agreement") is entered into by and between:\n\nProvider: True Lavender ("Provider")\n\nand\n\nClient: ______________________________________\n\nEffective Date: _________________________________\n\n---\n\n1. SERVICES PROVIDED\n\nTrue Lavender agrees to provide website design and development services based upon the package selected by the Client.\n\n□ Essential Website Package – $975\nIncludes:\n* Elegant single-page website\n* Up to six (6) sections\n* Contact form setup\n* Basic SEO configuration\n* Mobile optimization\nPayment Plan Option:\n$325/month for three (3) months\n\n□ Starter Website Package – $2,300\nIncludes:\n* Up to five (5) pages\n* CMS tutorial\n* Two reusable post templates\n* Accessibility and SEO essentials\n* Analytics goal setup\nPayment Plan Option:\n$575/month for four (4) months\n\n□ Commerce Website Package – $2,500\nIncludes:\n* E-commerce website setup\n* Up to seventeen (17) products uploaded\n* Payment processing setup\n* Tax and shipping configuration\n* Branded order emails\n* Quality assurance testing\n* Recorded handoff tutorial\nPayment Plan Option:\n$625/month for four (4) months\n\n□ Launch + Automate Package – $4,750\nIncludes everything in Starter plus:\n* Booking workflow setup\n* Contract automation\n* Payment automation\n* Social media kit\n* LavenderCare Plus onboarding\nPayment Plan Option:\n$950/month for five (5) months\n\nServices not specifically listed above are outside the scope of this Agreement and may require a separate quote.\n\nClient Initials: _______\n\n---\n\n2. PROJECT TIMELINE\n\nProvider will make reasonable efforts to complete the project within four (4) to six (6) weeks after receipt of all required materials from the Client.\n\nThe timeline may be extended due to:\n* Delayed content submissions;\n* Delayed approvals;\n* Scope changes requested by the Client;\n* Third-party platform delays.\n\nProvider shall not be responsible for delays outside its control.\n\n---\n\n3. CLIENT RESPONSIBILITIES\n\nClient agrees to:\n* Provide all required text, images, logos, and branding assets;\n* Supply content in a timely manner;\n* Review and approve materials promptly;\n* Respond to requests within three (3) business days.\n\nFailure to provide requested materials may delay completion.\n\nIf the Client becomes unresponsive for thirty (30) consecutive days, the project may be placed on hold.\n\nProjects inactive for sixty (60) consecutive days may be deemed abandoned. Any payments made remain non-refundable.\n\nClient Initials: _______\n\n---\n\n4. PAYMENT TERMS\n\nA non-refundable deposit equal to fifty percent (50%) of the project price is required before work begins.\n\nThe remaining balance must be paid in full before:\n* Website launch;\n* Transfer of ownership;\n* Release of files;\n* Delivery of administrative access.\n\nFor payment plans, scheduled payments must remain current. Failure to make payments may result in suspension of work.\n\nAll deposits and payments made for custom services are non-refundable.\n\nClient Initials: _______\n\n---\n\n5. REVISIONS\n\nEach website project includes two (2) rounds of minor revisions.\n\nMinor revisions include:\n* Text edits;\n* Image replacements;\n* Color adjustments;\n* Small layout modifications.\n\nMajor revisions, additional pages, new features, or requests outside the original scope will be billed separately at Provider\'s current hourly rate.\n\nClient Initials: _______\n\n---\n\n6. HOSTING & MAINTENANCE REQUIREMENT\n\nAll websites require active hosting and maintenance services to remain secure and operational.\n\nCurrent plans begin at:\n* $12.50 per month; or\n* $150 annually.\n\nClients may also elect to purchase LavenderCare maintenance services.\n\nHosting, domain registration, and maintenance fees are separate from website design fees.\n\nProvider shall not be responsible for website outages, expired domains, or interruptions caused by nonpayment of hosting or third-party providers.\n\n---\n\n7. THIRD-PARTY SERVICES\n\nThe Client understands that the project may utilize third-party services including, but not limited to:\n* Squarespace\n* Wix\n* Stripe\n* Square\n* Calendly\n* Zapier\n* Make\n* Mailchimp\n* HubSpot\n* Google Analytics\n* Social media platforms\n\nProvider is not responsible for:\n* Platform outages;\n* Software updates made by third parties;\n* Changes to pricing or policies;\n* Service interruptions outside Provider\'s control.\n\nAll subscription fees associated with third-party services are the sole responsibility of the Client.\n\nClient Initials: _______\n\n---\n\n8. INTELLECTUAL PROPERTY & OWNERSHIP\n\nUpon receipt of full payment, the Client shall receive ownership of the completed website and final deliverables.\n\nProvider retains ownership of:\n* Proprietary workflows;\n* Templates;\n* Internal systems;\n* Preliminary concepts not selected by Client.\n\nNo ownership transfers until all outstanding balances have been paid in full.\n\n---\n\n9. PORTFOLIO RIGHTS\n\nProvider reserves the right to display completed work, screenshots, project descriptions, and related materials in its portfolio, website, social media, and marketing materials unless otherwise agreed to in writing.\n\n---\n\n10. NO GUARANTEE OF RESULTS\n\nProvider does not guarantee:\n* Website traffic;\n* Search engine rankings;\n* Lead generation;\n* Revenue increases;\n* Sales conversions;\n* Business growth.\n\nClient acknowledges that results depend upon numerous factors outside Provider\'s control.\n\nClient Initials: _______\n\n---\n\n11. CONFIDENTIALITY\n\nBoth parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the project and shall not disclose such information without written consent except as required by law.\n\n---\n\n12. INDEPENDENT CONTRACTOR STATUS\n\nProvider is an independent contractor and not an employee, partner, agent, or joint venture of the Client.\n\n---\n\n13. CANCELLATION & REFUND POLICY\n\nEither party may terminate this Agreement by providing written notice.\n\nIf the Client cancels the project after work has begun:\n* Deposits remain non-refundable;\n* Work completed beyond the deposit amount shall be invoiced immediately;\n* Provider may stop work immediately.\n\nNo refunds shall be issued for completed or partially completed custom services.\n\nClient Initials: _______\n\n---\n\n14. CHARGEBACKS & PAYMENT DISPUTES\n\nClient agrees to contact Provider first regarding any concerns before initiating a chargeback or payment dispute.\n\nImproper chargebacks constitute a breach of this Agreement.\n\nProvider reserves the right to pursue recovery of attorney fees, collection costs, and damages associated with improper chargebacks.\n\nClient Initials: _______\n\n---\n\n15. INDEMNIFICATION\n\nClient agrees to indemnify and hold harmless True Lavender from claims arising from:\n* Client-provided materials;\n* Copyright infringement;\n* Trademark misuse;\n* False advertising claims;\n* Improper website usage.\n\nClient Initials: _______\n\n---\n\n16. LIMITATION OF LIABILITY\n\nProvider shall not be liable for:\n* Lost profits;\n* Lost revenue;\n* Indirect or consequential damages;\n* Third-party software failures;\n* Hosting interruptions;\n* Search engine changes.\n\nProvider\'s total liability shall never exceed the amount paid by Client under this Agreement.\n\nClient Initials: _______\n\n---\n\n17. FORCE MAJEURE\n\nProvider shall not be liable for delays resulting from circumstances beyond reasonable control, including:\n* Natural disasters;\n* Illness;\n* Internet outages;\n* Utility failures;\n* Government actions;\n* Labor disputes;\n* Third-party platform failures.\n\n---\n\n18. ENTIRE AGREEMENT\n\nThis Agreement represents the entire understanding between the parties and supersedes prior discussions, emails, messages, proposals, or verbal agreements.\n\n---\n\n19. SEVERABILITY\n\nIf any provision of this Agreement is found unenforceable, the remaining provisions shall remain in full force and effect.\n\n---\n\n20. GOVERNING LAW\n\nThis Agreement shall be governed by the laws of the State of Ohio.\n\nAny disputes shall be resolved exclusively in the courts of Ohio.\n\n---\n\n21. ELECTRONIC SIGNATURES\n\nElectronic signatures, digital acceptance, and payment submission shall have the same legal effect as handwritten signatures.\n\n---\n\nCLIENT ACKNOWLEDGMENT\nBy signing below, I acknowledge that I have read, understand, and agree to the terms listed above.'
    },
    {
      id: 'automation',
      name: 'Automation & CRM Services',
      serviceName: 'Automation & CRM Setup',
      amount: '$550.00',
      terms: 'AUTOMATION & CRM SERVICES AGREEMENT\n\nThis Automation & CRM Services Agreement ("Agreement") is entered into by and between:\n\nProvider: True Lavender ("Provider")\n\nand\n\nClient: ______________________________________\n\nEffective Date: _________________________________\n\n---\n\n1. SERVICES PROVIDED\n\nTrue Lavender agrees to provide automation and CRM setup services based on the package selected by the Client.\n\n□ Booking → Contract → Payment Automation – $850\nIncludes:\n* Calendly setup;\n* Custom intake forms;\n* Electronic signature workflow;\n* Stripe or Square payment integration;\n* Confirmation emails;\n* Analytics tracking.\nAdditional events: $150 each.\n\n□ Automation Starter – $550\nIncludes:\n* Two (2) automations;\n* Up to five (5) steps per workflow;\n* Zapier or Make setup;\n* Training handoff document;\n* Recorded walkthrough.\n\n□ Automation Pro – $1,500\nIncludes:\n* Multi-app workflows;\n* Up to twelve (12) workflow steps;\n* Error handling;\n* Thirty (30) days of monitoring.\n\n□ CRM Lite Setup – $950\nIncludes:\n* HubSpot, Zoho, or Mailchimp setup;\n* Audience and pipeline configuration;\n* Form capture setup;\n* Three-email welcome sequence.\n\nServices not specifically listed are outside the scope of this Agreement.\n\nClient Initials: _______\n\n---\n\n2. PROJECT TIMELINE\n\nProvider will make reasonable efforts to complete setup within the timeline agreed upon with the Client.\n\nProject timelines may be extended due to:\n* Delayed content;\n* Delayed approvals;\n* Additional requests;\n* Third-party platform delays.\n\n---\n\n3. CLIENT RESPONSIBILITIES\n\nClient agrees to:\n* Provide login access when necessary;\n* Supply branding assets and required content;\n* Maintain active subscriptions to third-party platforms;\n* Respond to requests within three (3) business days.\n\nProjects inactive for thirty (30) days may be placed on hold.\n\nProjects inactive for sixty (60) days may be considered abandoned and all payments made remain non-refundable.\n\nClient Initials: _______\n\n---\n\n4. PAYMENT TERMS\n\nA non-refundable deposit of fifty percent (50%) is required before work begins unless otherwise stated.\n\nThe remaining balance is due prior to final delivery.\n\nNo work shall be released until all invoices are paid in full.\n\nCompleted work and custom services are non-refundable.\n\nClient Initials: _______\n\n---\n\n5. THIRD-PARTY SOFTWARE DISCLAIMER\n\nClient acknowledges that these services may require third-party platforms including, but not limited to:\n* Calendly;\n* Stripe;\n* Square;\n* Zapier;\n* Make;\n* HubSpot;\n* Zoho;\n* Mailchimp;\n* Google Workspace.\n\nProvider is not responsible for:\n* Third-party outages;\n* Software changes;\n* Subscription fees;\n* Platform policy updates;\n* Loss of service caused by third parties.\n\nAll platform fees are the responsibility of the Client.\n\nClient Initials: _______\n\n---\n\n6. OWNERSHIP\n\nOwnership of completed workflows and deliverables transfers to the Client after full payment has been received.\n\nProvider retains ownership of:\n* Proprietary templates;\n* Internal processes;\n* Workflow frameworks.\n\n---\n\n7. NO GUARANTEE OF RESULTS\n\nProvider does not guarantee:\n* Increased sales;\n* Increased bookings;\n* Lead generation;\n* Revenue growth;\n* Marketing performance.\n\nClient understands that results depend upon factors outside Provider\'s control.\n\nClient Initials: _______\n\n---\n\n8. CONFIDENTIALITY\n\nBoth parties agree to maintain confidentiality regarding business information shared during the course of this project.\n\n---\n\n9. INDEPENDENT CONTRACTOR STATUS\n\nProvider is an independent contractor and not an employee, agent, or partner of the Client.\n\n---\n\n10. CANCELLATION & REFUND POLICY\n\nEither party may terminate this Agreement by written notice.\n\nAll deposits remain non-refundable.\n\nWork completed and time invested are non-refundable.\n\nClient Initials: _______\n\n---\n\n11. CHARGEBACKS\n\nClient agrees to contact Provider before initiating any chargeback or payment dispute.\n\nImproper chargebacks constitute a breach of this Agreement.\n\nProvider reserves the right to pursue collection costs, attorney fees, and damages.\n\nClient Initials: _______\n\n---\n\n12. INDEMNIFICATION\n\nClient agrees to indemnify and hold harmless True Lavender from claims arising from:\n* Client content;\n* Copyright infringement;\n* Misrepresentation;\n* Improper use of automation systems.\n\nClient Initials: _______\n\n---\n\n13. LIMITATION OF LIABILITY\n\nProvider shall not be liable for:\n* Lost profits;\n* Business interruptions;\n* Data loss;\n* Third-party platform failures.\n\nProvider\'s maximum liability shall not exceed the amount paid by Client under this Agreement.\n\nClient Initials: _______\n\n---\n\n14. FORCE MAJEURE\n\nProvider shall not be liable for delays caused by circumstances beyond reasonable control.\n\n---\n\n15. ENTIRE AGREEMENT\n\nThis Agreement supersedes all prior communications and constitutes the entire agreement between the parties.\n\n---\n\n16. SEVERABILITY\n\nIf any provision is determined unenforceable, the remaining provisions shall remain valid.\n\n---\n\n17. GOVERNING LAW\n\nThis Agreement shall be governed by the laws of the State of Ohio.\n\n---\n\n18. ELECTRONIC SIGNATURES\n\nElectronic signatures and payment submission shall have the same legal effect as handwritten signatures.\n\n---\n\nCLIENT ACKNOWLEDGMENT\nBy signing below, I acknowledge that I have read, understand, and agree to the terms listed above.'
    },
    {
      id: 'hosting',
      name: 'Hosting & Maintenance',
      serviceName: 'LavenderCare Hosting & Maintenance',
      amount: '$85.00 / month',
      terms: 'LAVENDERCARE HOSTING & MAINTENANCE AGREEMENT\n\nThis Hosting & Maintenance Agreement ("Agreement") is entered into by and between:\n\nProvider: True Lavender ("Provider")\n\nand\n\nClient: ______________________________________\n\nEffective Date: _________________________________\n\n---\n\n1. SERVICES PROVIDED\n\nTrue Lavender agrees to provide ongoing website hosting support and maintenance services based upon the plan selected by the Client.\n\n□ LavenderCare Basic – $85/month or $850/year\nIncludes:\n* Website monitoring;\n* Website backups;\n* Security monitoring;\n* Core platform updates.\n\n□ LavenderCare Plus – $175/month or $1,750/year\nIncludes everything in LavenderCare Basic plus:\n* Up to one and one-half (1.5) hours of content, design, or website updates per month.\n\n□ On-Call Support – $125/hour\nIncludes:\n* Additional support outside the selected maintenance plan;\n* Emergency edits;\n* Out-of-scope requests;\n* Additional design or development work.\n\nServices not specifically included within the selected plan are outside the scope of this Agreement and may require separate billing.\n\nClient Initials: _______\n\n---\n\n2. BILLING TERMS\n\nMonthly plans are billed automatically every month.\n\nAnnual plans are billed once annually.\n\nInvoices not paid within seven (7) days may result in suspension of maintenance services.\n\nFailure to maintain active payments may result in:\n* Suspension of support;\n* Website vulnerabilities;\n* Interrupted service.\n\nMaintenance fees are separate from hosting fees, domain fees, and third-party subscriptions.\n\nClient Initials: _______\n\n---\n\n3. AUTOMATIC RENEWAL\n\nMaintenance plans automatically renew until canceled in accordance with this Agreement.\n\nClient authorizes recurring billing for the selected plan.\n\nClient Initials: _______\n\n---\n\n4. UNUSED TIME POLICY\n\nUnused update hours included in LavenderCare Plus do not roll over to future months.\n\nUnused hours have no cash value and are forfeited at the end of each billing cycle.\n\nClient Initials: _______\n\n---\n\n5. RESPONSE TIMES\n\nProvider will make reasonable efforts to respond to support requests within:\n* Two (2) business days for standard requests;\n* One (1) business day for urgent issues.\n\nResponse times are estimates and are not guaranteed service-level agreements.\n\n---\n\n6. OUT-OF-SCOPE WORK\n\nThe following are considered additional services and may be billed separately:\n* New page creation;\n* E-commerce additions;\n* Major redesigns;\n* Platform migrations;\n* Complex troubleshooting;\n* Third-party integrations.\n\nOn-Call Support services are billed at $125 per hour.\n\n---\n\n7. THIRD-PARTY SERVICES\n\nClient acknowledges that Provider may work with third-party services including but not limited to:\n* Squarespace;\n* Wix;\n* WordPress;\n* Stripe;\n* Calendly;\n* Mailchimp;\n* HubSpot;\n* Zapier;\n* Hosting providers;\n* Domain registrars.\n\nProvider is not responsible for:\n* Third-party outages;\n* Software changes;\n* Price increases;\n* Hosting failures;\n* Domain expiration;\n* External security breaches.\n\nAll third-party subscription fees remain the responsibility of the Client.\n\nClient Initials: _______\n\n---\n\n8. NO GUARANTEE OF UPTIME\n\nProvider makes reasonable efforts to maintain website functionality but does not guarantee:\n* Continuous uptime;\n* Error-free performance;\n* Immunity from cyberattacks;\n* Search engine rankings;\n* Protection from third-party failures.\n\nClient Initials: _______\n\n---\n\n9. CANCELLATION\n\nEither party may terminate this Agreement by providing thirty (30) days written notice.\n\nNo refunds or prorated refunds shall be issued for partially used billing periods.\n\nServices remain active through the end of the paid billing cycle.\n\nClient Initials: _______\n\n---\n\n10. CHARGEBACKS\n\nClient agrees to contact Provider regarding any concerns prior to initiating a chargeback or payment dispute.\n\nImproper chargebacks constitute a breach of this Agreement.\n\nProvider reserves the right to pursue collection costs, attorney fees, and damages resulting from improper chargebacks.\n\nClient Initials: _______\n\n---\n\n11. CONFIDENTIALITY\n\nBoth parties agree to maintain the confidentiality of proprietary information shared during the course of this Agreement.\n\n---\n\n12. INDEPENDENT CONTRACTOR STATUS\n\nProvider is an independent contractor and is not an employee, partner, or agent of the Client.\n\n---\n\n13. INDEMNIFICATION\n\nClient agrees to indemnify and hold harmless True Lavender from claims arising from:\n* Client content;\n* Copyright infringement;\n* Trademark misuse;\n* Improper use of the website;\n* Actions taken by third-party providers.\n\nClient Initials: _______\n\n---\n\n14. LIMITATION OF LIABILITY\n\nProvider shall not be liable for:\n* Lost profits;\n* Lost revenue;\n* Business interruption;\n* Data loss;\n* Third-party failures;\n* Hosting outages.\n\nProvider\'s total liability shall not exceed the amount paid by Client under this Agreement during the previous twelve (12) months.\n\nClient Initials: _______\n\n---\n\n15. FORCE MAJEURE\n\nProvider shall not be liable for delays or interruptions caused by circumstances beyond reasonable control including natural disasters, illness, internet outages, labor disputes, governmental actions, or third-party failures.\n\n---\n\n16. ENTIRE AGREEMENT\n\nThis Agreement constitutes the entire understanding between the parties and supersedes all prior discussions, communications, emails, and verbal agreements.\n\n---\n\n17. SEVERABILITY\n\nIf any provision of this Agreement is found unenforceable, the remaining provisions shall remain valid and enforceable.\n\n---\n\n18. GOVERNING LAW\n\nThis Agreement shall be governed by the laws of the State of Ohio.\n\nAny disputes arising under this Agreement shall be resolved exclusively within the State of Ohio.\n\n---\n\n19. ELECTRONIC SIGNATURES\n\nElectronic signatures, digital acceptance, and payment submission shall have the same legal effect as original handwritten signatures.\n\n---\n\nCLIENT ACKNOWLEDGMENT\nBy signing below, I acknowledge that I have read, understand, and agree to the terms listed above.'
    },
    {
      id: 'presentations',
      name: 'Presentation Design',
      serviceName: 'Presentation & PowerPoint Design',
      amount: '$347.00',
      terms: 'PRESENTATION & POWERPOINT DESIGN AGREEMENT\n\nThis Presentation Design Agreement ("Agreement") is entered into by and between:\n\nProvider: True Lavender ("Provider")\n\nand\n\nClient: ______________________________________\n\nEffective Date: _________________________________\n\n---\n\n1. SERVICES PROVIDED\n\nTrue Lavender agrees to provide presentation design services based on the package selected by the Client.\n\n□ Clarity Deck – $197\nIncludes:\n* Up to ten (10) custom slides;\n* One cohesive branded design;\n* One (1) round of revisions;\n* Five (5) business-day turnaround.\nPayment Option:\n* $97 due at booking;\n* Remaining $100 due upon delivery.\n\n□ Signature Story Deck – $347\nIncludes:\n* Up to twenty (20) custom slides;\n* Storyline and slide flow organization;\n* Branded icons and simple diagrams;\n* Two (2) rounds of revisions.\nPayment Option:\n* $147 due at booking;\n* Remaining $200 due upon delivery.\n\n□ Investor & Executive Pitch Deck – $750\nIncludes:\n* Up to thirty (30) custom slides;\n* Narrative positioning support;\n* Data and metric slide formatting;\n* Two to three (2–3) rounds of revisions.\nPayment Option:\n* $250 due at booking;\n* Remaining $500 due upon delivery.\n\nServices not specifically included in the selected package are outside the scope of this Agreement.\n\nClient Initials: _______\n\n---\n\n2. PROJECT TIMELINE\n\nProvider will make reasonable efforts to complete the project within the estimated turnaround time associated with the selected package.\n\nProject timelines may be extended due to:\n* Delays in receiving content;\n* Delays in approvals or feedback;\n* Scope changes requested by Client.\n\nProvider shall not be responsible for delays caused by the Client.\n\n---\n\n3. CLIENT RESPONSIBILITIES\n\nClient agrees to provide:\n* Logos and branding assets;\n* Text and presentation content;\n* Images, charts, or supporting documents;\n* Feedback and approvals within three (3) business days.\n\nProjects inactive for thirty (30) days may be placed on hold.\n\nProjects inactive for sixty (60) days may be considered abandoned and all payments made shall remain non-refundable.\n\nClient Initials: _______\n\n---\n\n4. PAYMENT TERMS\n\nBooking deposits are non-refundable.\n\nRemaining balances must be paid before:\n* Editable files are released;\n* Final presentation files are delivered.\n\nFailure to make payments may result in suspension of work.\n\nNo refunds shall be issued for custom work already completed.\n\nClient Initials: _______\n\n---\n\n5. REVISIONS\n\nIncluded revisions are:\n* Clarity Deck: One (1) round;\n* Signature Story Deck: Two (2) rounds;\n* Investor & Executive Deck: Up to three (3) rounds.\n\nAdditional revisions, slide additions, or changes outside the original scope will be billed separately.\n\nClient Initials: _______\n\n---\n\n6. OWNERSHIP\n\nUpon receipt of full payment, ownership of the final presentation transfers to the Client.\n\nProvider retains ownership of:\n* Preliminary concepts;\n* Unused drafts;\n* Internal templates and workflows.\n\n---\n\n7. PORTFOLIO RIGHTS\n\nProvider reserves the right to display completed work within its portfolio, website, and marketing materials unless otherwise agreed in writing.\n\n---\n\n8. NO GUARANTEE OF RESULTS\n\nProvider does not guarantee:\n* Funding approvals;\n* Sales results;\n* Audience response;\n* Speaking outcomes;\n* Investor decisions.\n\nClient acknowledges that presentation results depend on factors outside Provider\'s control.\n\nClient Initials: _______\n\n---\n\n9. CONFIDENTIALITY\n\nBoth parties agree to maintain confidentiality regarding proprietary information shared during the project.\n\n---\n\n10. CANCELLATION & REFUND POLICY\n\nEither party may terminate this Agreement with written notice.\n\nAll deposits remain non-refundable.\n\nCompleted work and time invested are non-refundable.\n\nClient Initials: _______\n\n---\n\n11. CHARGEBACKS\n\nClient agrees to contact Provider regarding any concerns before initiating a chargeback or payment dispute.\n\nImproper chargebacks constitute a breach of this Agreement.\n\nClient Initials: _______\n\n---\n\n12. INDEMNIFICATION\n\nClient agrees to indemnify and hold harmless True Lavender from claims resulting from:\n* Client-provided content;\n* Copyright violations;\n* Trademark misuse;\n* False or misleading information.\n\nClient Initials: _______\n\n---\n\n13. LIMITATION OF LIABILITY\n\nProvider shall not be liable for indirect, incidental, or consequential damages.\n\nProvider\'s maximum liability shall not exceed the amount paid by Client under this Agreement.\n\nClient Initials: _______\n\n---\n\n14. FORCE MAJEURE\n\nProvider shall not be liable for delays caused by events beyond reasonable control.\n\n---\n\n15. ENTIRE AGREEMENT\n\nThis Agreement constitutes the entire understanding between the parties and supersedes prior discussions or communications.\n\n---\n\n16. SEVERABILITY\n\nIf any provision is deemed unenforceable, the remaining provisions shall remain valid.\n\n---\n\n17. GOVERNING LAW\n\nThis Agreement shall be governed by the laws of the State of Ohio.\n\n---\n\n18. ELECTRONIC SIGNATURES\n\nElectronic signatures and payment submission shall have the same legal effect as handwritten signatures.\n\n---\n\nCLIENT ACKNOWLEDGMENT\nBy signing below, I acknowledge that I have read, understand, and agree to the terms listed above.'
    },
    {
      id: 'consulting',
      name: 'Custom Consulting',
      serviceName: 'Digital Strategy Consulting',
      amount: '$500.00',
      terms: '1. SERVICES PROVIDED\nTrue Lavender ("Consultant") agrees to provide expert consultation, brand strategy, and technical guidance as requested by the Client.\n\n2. ENGAGEMENT SCOPE\nThe Consultant will provide actionable advice, documentation, and a targeted roadmap tailored to the Client\'s digital presence.\n\n3. CONFIDENTIALITY\nBoth parties agree to treat all shared business information, strategies, and proprietary data as strictly confidential and will not disclose it to third parties without prior written consent.\n\n4. PAYMENT\nThe total consulting fee is due prior to the delivery of the final strategy documents and roadmap. For ongoing hourly consulting, invoices will be sent on a bi-weekly basis with net-15 payment terms.\n\n5. INDEPENDENT CONTRACTOR\nThe Consultant is an independent contractor, not an employee. The Consultant retains complete control over the manner in which the services are performed.\n\n6. NO GUARANTEE OF RESULTS\nWhile the Consultant provides expert advice based on industry best practices, they do not guarantee specific business outcomes, revenue increases, or specific search engine rankings.\n\n7. LIMITATION OF LIABILITY\nThe Consultant shall not be liable for any indirect, incidental, or consequential damages resulting from the implementation of the provided strategy.'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    if (!templateId) return;
    const template = contractTemplates.find(t => t.id === templateId);
    if (template) {
      setContractServiceName(template.serviceName);
      setContractAmount(template.amount);
      setContractTerms(template.terms);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    if (user.email !== 'antoinettewilliams@thetruelavender.online' && user.email !== 'antoinetteqwilliams@gmail.com') {
      return;
    }

    // Meetings subscription
    const qMeetings = query(
      collection(db, 'meetings'),
      where('hostId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubMeetings = onSnapshot(qMeetings, (snapshot) => {
      setMeetings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Messages subscription
    const qMessages = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Contracts subscription
    const qContracts = query(
      collection(db, 'contracts'),
      orderBy('createdAt', 'desc')
    );
    const unsubContracts = onSnapshot(qContracts, (snapshot) => {
      setContracts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubMeetings();
      unsubMessages();
      unsubContracts();
    };
  }, [user]);

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingContractId) {
        await updateDoc(doc(db, 'contracts', editingContractId), {
          clientName: contractClientName,
          clientEmail: contractClientEmail,
          serviceName: contractServiceName,
          amount: contractAmount,
          terms: contractTerms,
        });
      } else {
        await addDoc(collection(db, 'contracts'), {
          hostId: user.uid,
          clientName: contractClientName,
          clientEmail: contractClientEmail,
          serviceName: contractServiceName,
          amount: contractAmount,
          terms: contractTerms,
          adminSignature: 'Antoinette Williams',
          adminSignedAt: Date.now(),
          clientSignature: null,
          clientSignedAt: null,
          status: 'sent',
          createdAt: Date.now(),
        });
      }
      setIsCreatingContract(false);
      setEditingContractId(null);
      setContractClientName('');
      setContractClientEmail('');
      setContractAmount('');
      setContractServiceName('Website Build & Strategy');
    } catch (err: any) {
      console.error('Failed to save contract', err);
      alert('Failed to save contract: ' + err.message);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Filter out empty times
    const times = proposedTimes.filter(t => t.trim() !== '');
    if (times.length === 0) {
      alert('Please add at least one proposed time slot.');
      return;
    }

    // Generate a Jitsi meet link based on title and a random string
    const baseUrl = 'https://meet.jit.si/';
    const roomName = `TrueLavender_${title.replace(/\s+/g, '_')}_${Math.random().toString(36).substring(7)}`;

    try {
      await addDoc(collection(db, 'meetings'), {
        hostId: user.uid,
        title,
        description,
        proposedTimes: times,
        status: 'proposed',
        meetUrl: baseUrl + roomName,
        createdAt: Date.now(),
        recipientEmail,
        recipientFirstName,
        recipientLastName
      });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setProposedTimes(['']);
      setRecipientEmail('');
      setRecipientFirstName('');
      setRecipientLastName('');
    } catch (err: any) {
      console.error('Failed to create meeting offer', err);
      alert('Failed to create meeting offer: ' + err.message);
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      await updateDoc(doc(db, 'meetings', id), { status: 'deleted' });
    } catch (error: any) {
      console.error(error);
      alert('Failed to trash meeting: ' + error.message);
    }
  };

  const restoreMeeting = async (id: string) => {
    try {
      await updateDoc(doc(db, 'meetings', id), { status: 'proposed' });
    } catch (error: any) {
      console.error(error);
      alert('Failed to restore meeting: ' + error.message);
    }
  };

  const permanentlyDeleteMeeting = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'meetings', id));
    } catch (error: any) {
      console.error(error);
      alert('Failed to delete meeting: ' + error.message);
    }
  };
  
  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error: any) {
      console.error(error);
      alert('Failed to delete message: ' + error.message);
    }
  };

  const markMessageRead = async (id: string, readStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: readStatus });
    } catch (error: any) {
      console.error(error);
    }
  };

  const getBaseUrl = () => appUrl;

  const copyLink = (id: string, type: 'meet' | 'contract' = 'meet') => {
    const url = `${getBaseUrl()}?${type}=${id}`;
    navigator.clipboard.writeText(url);
    alert(`${type === 'meet' ? 'Meeting' : 'Contract'} link copied to clipboard!`);
  };

  const downloadICS = (meeting: any) => {
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const timeStr = meeting.selectedTime || meeting.proposedTimes[0];
    const startDate = new Date(timeStr);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const dtStart = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dtEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//True Lavender//Meeting Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${meeting.title}`,
      `DESCRIPTION:${meeting.description ? meeting.description.replace(/\n/g, '\\n') : ''}\\n\\nMeeting Link: ${meeting.meetUrl}`,
      `LOCATION:${meeting.meetUrl}`,
      `UID:${meeting.id}@thetruelavender.online`,
      `ORGANIZER;CN="True Lavender":mailto:antoinettewilliams@thetruelavender.online`
    ];

    if (meeting.recipientEmail) {
      let attendeeLine = `ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION`;
      if (meeting.recipientFirstName) {
        attendeeLine += `;CN="${meeting.recipientFirstName} ${meeting.recipientLastName || ''}".trim()`;
      }
      attendeeLine += `:mailto:${meeting.recipientEmail}`;
      icsLines.push(attendeeLine);
    }

    icsLines.push(
      'END:VEVENT',
      'END:VCALENDAR'
    );

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invite-${meeting.title.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyRichTextEmail = async (meeting: any) => {
    try {
      const htmlContent = `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <p>Hi ${meeting.recipientFirstName || 'there'},</p>
          <p>I'm reaching out to get our meeting about <strong>${meeting.title}</strong> on the calendar. Select the time below that works best for you:</p>
          <div style="margin: 20px 0;">
            ${meeting.proposedTimes.map((t: string) => `
              <div style="margin-bottom: 12px;">
                <a href="${getBaseUrl()}?meet=${meeting.id}&time=${encodeURIComponent(t)}" style="display: inline-block; padding: 10px 20px; background-color: #6a4b9c; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">
                  Select: ${format(new Date(t), "EEEE, MMM d, yyyy 'at' h:mm a")}
                </a>
              </div>
            `).join('')}
          </div>
          <p>If that doesn't fit your schedule, please let me know and we can find another time.</p>
          <p style="margin-bottom: 20px;">Best,<br>Antoinette Williams</p>
          <a href="https://www.thetruelavender.com" style="display: inline-block; padding: 10px 20px; background-color: #f3f4f6; color: #4b5563; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; border: 1px solid #e5e7eb;">
            Visit www.thetruelavender.com
          </a>
        </div>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
      alert('Rich text email with buttons copied! You can now paste it directly into composing an email in Zoho Mail.');
    } catch (err) {
      console.error('Failed to copy rich text', err);
      alert('Failed to copy rich text. Your browser might not support this feature.');
    }
  };

  if (!user) return null;

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600 font-light mt-1">Manage your appointment availability and client inquiries</p>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
        
        <div className="flex gap-4 mb-10 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('meetings')}
            className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'meetings' ? 'text-lavender-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Meetings
            </span>
            {activeTab === 'meetings' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lavender-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'messages' ? 'text-lavender-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Messages
              {messages.filter(m => !m.read).length > 0 && (
                <span className="bg-lavender-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </span>
            {activeTab === 'messages' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lavender-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'contracts' ? 'text-lavender-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Contracts
            </span>
            {activeTab === 'contracts' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lavender-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'trash' ? 'text-lavender-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <span className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Trash
              {meetings.filter(m => m.status === 'deleted').length > 0 && (
                <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {meetings.filter(m => m.status === 'deleted').length}
                </span>
              )}
            </span>
            {activeTab === 'trash' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lavender-600 rounded-t-full" />
            )}
          </button>
        </div>

        {activeTab === 'meetings' && (
          <div>
            {isCreating ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Create Meeting Offer</h3>
                <form onSubmit={handleCreateOffer} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      required
                      placeholder="e.g. Initial Consultation"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500 h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient First Name (Optional)</label>
                      <input 
                        type="text" 
                        value={recipientFirstName} 
                        onChange={e => setRecipientFirstName(e.target.value)} 
                        placeholder="e.g. Jane"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Last Name (Optional)</label>
                      <input 
                        type="text" 
                        value={recipientLastName} 
                        onChange={e => setRecipientLastName(e.target.value)} 
                        placeholder="e.g. Doe"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email (Optional)</label>
                      <input 
                        type="email" 
                        value={recipientEmail} 
                        onChange={e => setRecipientEmail(e.target.value)} 
                        placeholder="client@example.com"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Propose Times (Client can select one)</label>
                    {proposedTimes.map((time, idx) => (
                      <div key={idx} className="flex gap-3 mb-3">
                        <input 
                          type="datetime-local" 
                          value={time} 
                          required
                          onChange={(e) => {
                            const newTimes = [...proposedTimes];
                            newTimes[idx] = e.target.value;
                            setProposedTimes(newTimes);
                          }}
                          className="flex-grow p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                        />
                        {proposedTimes.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setProposedTimes(proposedTimes.filter((_, i) => i !== idx))}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setProposedTimes([...proposedTimes, ''])}
                      className="text-sm text-lavender-600 font-medium hover:text-lavender-700 flex items-center gap-1 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add another time slot
                    </button>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-50">
                    <button 
                      type="button" 
                      onClick={() => setIsCreating(false)}
                      className="px-6 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-3 rounded-xl bg-lavender-600 text-white font-medium hover:bg-lavender-700 transition-colors"
                    >
                      Generate Meeting Link
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button 
                onClick={() => setIsCreating(true)}
                className="mb-10 px-6 py-3 rounded-xl bg-lavender-600 text-white font-medium hover:bg-lavender-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Create Meeting Offer
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meetings.filter(m => m.status !== 'deleted').map(meeting => (
                <div key={meeting.id} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative ${meeting.status === 'confirmed' ? 'border-l-4 border-l-green-500' : ''}`}>
                   <button 
                    onClick={() => deleteMeeting(meeting.id)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 transition-colors p-2 rounded-lg flex items-center gap-1 text-sm font-medium border border-transparent hover:border-red-100"
                    title="Delete meeting offer"
                   >
                     <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
                   </button>
                   
                   <h4 className="text-xl font-bold text-gray-900 pr-8">{meeting.title}</h4>
                   {meeting.description && <p className="text-sm text-gray-500 mt-2">{meeting.description}</p>}
                   
                   <div className="mt-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${meeting.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {meeting.status}
                        </span>
                      </div>

                      {meeting.status === 'confirmed' ? (
                        <div className="space-y-3 mt-4">
                          <p className="text-sm text-gray-800 flex items-center gap-2 font-medium">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {meeting.selectedTime ? format(new Date(meeting.selectedTime), "MMM d, yyyy 'at' h:mm a") : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>With:</strong> {meeting.guestName} ({meeting.guestEmail})
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <a href={meeting.meetUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-lavender-600 hover:text-lavender-700 font-medium bg-lavender-50 px-3 py-1.5 rounded-lg">
                              <Video className="w-4 h-4" /> Join Jitsi Call
                            </a>
                            <button 
                              onClick={() => downloadICS(meeting)}
                              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                              title="Download calendar event file"
                            >
                              <Calendar className="w-4 h-4" /> ICS
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Proposed Times</p>
                          <ul className="space-y-1 mb-4">
                            {meeting.proposedTimes.map((t: string, i: number) => (
                               <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-lavender-300" />
                                 {format(new Date(t), "MMM d, yyyy h:mm a")}
                               </li>
                            ))}
                          </ul>
                          <div className="mt-6 pt-6 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Share Invitation</p>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                                <input 
                                  type="text" 
                                  readOnly 
                                  value={`${getBaseUrl()}?meet=${meeting.id}`} 
                                  className="flex-1 bg-transparent text-sm text-gray-600 outline-none px-2 cursor-pointer w-full min-w-0" 
                                  onClick={(e) => e.currentTarget.select()}
                                />
                                <button 
                                  onClick={() => copyLink(meeting.id)} 
                                  className="p-2 bg-lavender-50 hover:bg-lavender-100 text-lavender-600 rounded-lg transition-colors flex-shrink-0"
                                  title="Copy Link"
                                >
                                  <LinkIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <button 
                                onClick={() => copyRichTextEmail(meeting)}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm text-sm"
                                title="Copies a rich graphical email with click-able buttons, so you can paste it directly into composing an email in Zoho Mail"
                              >
                                <Mail className="w-4 h-4" /> 
                                Copy Email with Buttons
                              </button>
                              <a 
                                href={`mailto:${meeting.recipientEmail || ''}?subject=${encodeURIComponent(`Invitation to Schedule: ${meeting.title}`)}&body=${encodeURIComponent(`Hi ${meeting.recipientFirstName || 'there'},\n\nI'm reaching out to get our meeting about ${meeting.title} on the calendar. Select the time below that works best for you:\n\n${meeting.proposedTimes.map((t: string) => `• ${format(new Date(t), "EEEE, MMM d, yyyy 'at' h:mm a")}\n  Select this time: ${getBaseUrl()}?meet=${meeting.id}&time=${encodeURIComponent(t)}`).join('\n\n')}\n\nIf that doesn't fit your schedule, please let me know and we can find another time.\n\nBest,\nAntoinette Williams\nhttps://www.thetruelavender.com`)}`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm"
                              >
                                <Mail className="w-4 h-4" /> 
                                Open Plain Text Draft (Mail App)
                              </a>
                              <button 
                                onClick={() => downloadICS(meeting)}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm"
                                title="Download .ics file to attach to Zoho Mail for a native Calendar invitation"
                              >
                                <Calendar className="w-4 h-4" /> Download .ics (To send via Zoho)
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                   </div>
                </div>
              ))}
              
              {meetings.length === 0 && !isCreating && (
                 <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100">
                   <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-1">No meetings scheduled</h3>
                   <p className="text-gray-500 text-sm">Create an offer to send to a client.</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                 <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                 <p className="text-gray-500 text-sm">When clients contact you, they will appear here.</p>
               </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`bg-white p-6 rounded-2xl border ${!msg.read ? 'border-lavender-300 shadow-md bg-lavender-50/30' : 'border-gray-100 shadow-sm'} relative transition-colors`}>
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button 
                      onClick={() => markMessageRead(msg.id, !msg.read)}
                      className={`p-2 rounded-lg transition-colors ${msg.read ? 'text-gray-400 hover:text-lavender-600 hover:bg-lavender-50' : 'text-lavender-600 hover:bg-lavender-100 bg-lavender-50'}`}
                      title={msg.read ? "Mark unread" : "Mark read"}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="pr-24">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {msg.name} 
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-lavender-500 inline-block ml-2" />}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">{msg.email} &bull; {format(new Date(msg.createdAt), "MMM d, yyyy h:mm a")}</p>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap text-sm border border-gray-100">
                      {msg.message}
                    </div>
                    <div className="mt-4">
                      <a 
                        href={`mailto:${msg.email}`}
                        className="text-sm font-medium text-lavender-600 hover:text-lavender-700"
                      >
                        Reply via Email &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'trash' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Trashed Meetings</h3>
            {meetings.filter(m => m.status === 'deleted').length === 0 ? (
              <p className="text-gray-500">No trashed meetings.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meetings.filter(m => m.status === 'deleted').map(meeting => (
                  <div key={meeting.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 opacity-75">
                     <h4 className="text-xl font-bold text-gray-700 pr-8 line-through">{meeting.title}</h4>
                     {meeting.description && <p className="text-sm text-gray-400 mt-2">{meeting.description}</p>}
                     
                     <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                        <button 
                          onClick={() => restoreMeeting(meeting.id)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Restore
                        </button>
                        <button 
                          onClick={() => permanentlyDeleteMeeting(meeting.id)}
                          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          Delete Permanently
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div>
            {isCreatingContract ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{editingContractId ? 'Edit Contract' : 'Create New Contract'}</h3>
                <form onSubmit={handleSaveContract} className="space-y-6">
                  {!editingContractId && (
                    <div className="mb-6 p-4 bg-lavender-50 rounded-xl border border-lavender-100">
                      <label className="block text-sm font-bold text-lavender-900 mb-2">Pre-fill from Template</label>
                      <select 
                        onChange={e => handleTemplateSelect(e.target.value)}
                        className="w-full p-3 rounded-xl border border-lavender-200 bg-white focus:outline-none focus:border-lavender-500 text-gray-700"
                      >
                        <option value="">Select a template...</option>
                        {contractTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-lavender-600 mt-2">Selecting a template will auto-fill the Service, Amount, and Terms fields below.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                      <input 
                        type="text" 
                        value={contractClientName} 
                        onChange={e => setContractClientName(e.target.value)} 
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
                      <input 
                        type="email" 
                        value={contractClientEmail} 
                        onChange={e => setContractClientEmail(e.target.value)} 
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Provided (e.g. Starter Build)</label>
                      <input 
                        type="text" 
                        value={contractServiceName} 
                        onChange={e => setContractServiceName(e.target.value)} 
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (e.g. $2,300)</label>
                      <input 
                        type="text" 
                        value={contractAmount} 
                        onChange={e => setContractAmount(e.target.value)} 
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contract Terms</label>
                    <textarea 
                      value={contractTerms} 
                      onChange={e => setContractTerms(e.target.value)} 
                      required
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500 h-32 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-50">
                    <button 
                      type="submit" 
                      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                      Sign & Generate Link
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsCreatingContract(false);
                        setEditingContractId(null);
                        setContractClientName('');
                        setContractClientEmail('');
                        setContractAmount('');
                        setContractServiceName('');
                      }}
                      className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Client Contracts</h3>
                <button 
                  onClick={() => setIsCreatingContract(true)}
                  className="bg-lavender-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-lavender-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Contract
                </button>
              </div>
            )}

            {!isCreatingContract && contracts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">No Contracts Yet</h4>
                <p className="text-gray-500 mb-6 font-light max-w-sm mx-auto">Generate service agreements for your clients so they can sign digitally.</p>
                <button 
                  onClick={() => setIsCreatingContract(true)}
                  className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create First Contract
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {contracts.map(contract => (
                  <div key={contract.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <h4 className="text-xl font-bold text-gray-900">{contract.serviceName}</h4>
                         <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${contract.clientSignature ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                           {contract.clientSignature ? 'Signed' : 'Pending'}
                         </span>
                       </div>
                       <p className="text-sm text-gray-500 flex items-center gap-2">
                         <User className="w-4 h-4" /> {contract.clientName} ({contract.clientEmail})
                       </p>
                       <p className="text-sm text-gray-500 mt-1">Amount: {contract.amount}</p>
                     </div>
                     <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                       <a
                         href={`/?contract=${contract.id}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex-1 sm:flex-none justify-center px-4 py-2 border border-lavender-200 text-lavender-700 bg-lavender-50 rounded-xl text-sm font-medium hover:bg-lavender-100 transition-colors flex items-center gap-2"
                       >
                         View Contract
                       </a>
                       <button
                         onClick={() => copyLink(contract.id, 'contract')}
                         className="flex-1 sm:flex-none justify-center px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                       >
                         <LinkIcon className="w-4 h-4" /> Copy Link
                       </button>
                       <button
                         onClick={() => {
                           setEditingContractId(contract.id);
                           setContractClientName(contract.clientName);
                           setContractClientEmail(contract.clientEmail);
                           setContractServiceName(contract.serviceName);
                           setContractAmount(contract.amount);
                           setContractTerms(contract.terms);
                           setIsCreatingContract(true);
                           setActiveTab('contracts');
                         }}
                         className="flex-1 sm:flex-none justify-center px-4 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                       >
                         <Edit className="w-4 h-4" /> Edit
                       </button>
                       <button
                         onClick={async () => {
                           try {
                             await deleteDoc(doc(db, 'contracts', contract.id));
                           } catch (err: any) {
                             alert('Failed to delete contract: ' + err.message);
                           }
                         }}
                         className="flex-1 sm:flex-none justify-center px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                       >
                         <Trash2 className="w-4 h-4" /> Delete
                       </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
