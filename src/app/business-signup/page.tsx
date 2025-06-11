'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  ChartBarIcon,
  MegaphoneIcon,
  CameraIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

interface FormData {
  businessName: string
  contactName: string
  email: string
  phone: string
  businessType: string
  address: string
  website: string
  currentMarketing: string[]
  monthlyMarketingBudget: string
  primaryGoals: string[]
  preferredTier: string
  additionalRequirements: string
  hearAboutUs: string
}

const businessTypes = [
  'Restaurant/Cafe/Pub',
  'Retail Shop',
  'Professional Services',
  'Health & Beauty',
  'Automotive',
  'Home & Garden',
  'Education/Training',
  'Fitness/Sports',
  'Entertainment',
  'Technology',
  'Other'
]

const marketingChannels = [
  'LiveLocalAds magazine',
  'Facebook advertising',
  'Google Ads',
  'Leaflet distribution',
  'Local newspaper',
  'Word of mouth',
  'None currently'
]

const businessGoals = [
  'Increase foot traffic',
  'Generate more phone calls',
  'Improve online presence',
  'Compete with larger businesses',
  'Target specific neighborhoods',
  'Build customer reviews',
  'Increase brand awareness'
]

export default function BusinessSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    address: '',
    website: '',
    currentMarketing: [],
    monthlyMarketingBudget: '',
    primaryGoals: [],
    preferredTier: 'premium',
    additionalRequirements: '',
    hearAboutUs: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayInputChange = (field: 'currentMarketing' | 'primaryGoals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/business-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitSuccess(true)
      } else {
        console.error('Signup failed:', result.message)
        alert('There was an error submitting your application. Please try again.')
      }
      
    } catch (error) {
      console.error('Signup error:', error)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <CheckCircleIconSolid className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You, {formData.contactName}!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              We've received your application for <strong>{formData.businessName}</strong>. 
              Our team will contact you within 24 hours to discuss your premium listing and leaflet campaign.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-left text-blue-800 space-y-2">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3">1</span>
                  We'll call you to discuss your specific needs
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3">2</span>
                  Set up your premium business profile
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3">3</span>
                  Design your first leaflet campaign
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3">4</span>
                  Launch and start seeing results!
                </li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get More Customers with <span className="text-yellow-300">Wellingborough.ai</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Premium digital listing + monthly leaflet campaigns that actually work
            </p>
            
            {/* Competitive Comparison */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-yellow-300">💰 Save Money. Get Better Results.</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-red-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-200 mb-2">❌ LiveLocalAds (Old Way)</h4>
                  <ul className="text-sm space-y-1 text-red-100">
                    <li>• £150 minimum (3 months)</li>
                    <li>• Print only, no digital presence</li>
                    <li>• No performance tracking</li>
                    <li>• £45 per 1,000 leaflets</li>
                    <li>• Design costs extra (£25+)</li>
                  </ul>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-200 mb-2">✅ Wellingborough.ai (Smart Way)</h4>
                  <ul className="text-sm space-y-1 text-green-100">
                    <li>• £25/month (no long-term contract)</li>
                    <li>• Premium digital + leaflet campaigns</li>
                    <li>• Real-time analytics & ROI tracking</li>
                    <li>• £35 per 1,000 leaflets (22% savings)</li>
                    <li>• AI-powered design included FREE</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex justify-between items-center text-sm">
              <span className={`font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                1. Business Info
              </span>
              <span className={`font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                2. Marketing Goals
              </span>
              <span className={`font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                3. Package Selection
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="px-8 py-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your business</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your business name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="01933 xxx xxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select your business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Full business address"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (if you have one)
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your marketing goals</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What marketing do you currently use? (Select all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {marketingChannels.map((channel) => (
                        <label key={channel} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.currentMarketing.includes(channel)}
                            onChange={() => handleArrayInputChange('currentMarketing', channel)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly marketing budget
                    </label>
                    <select
                      value={formData.monthlyMarketingBudget}
                      onChange={(e) => handleInputChange('monthlyMarketingBudget', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your budget range</option>
                      <option value="under-100">Under £100</option>
                      <option value="100-250">£100 - £250</option>
                      <option value="250-500">£250 - £500</option>
                      <option value="500-1000">£500 - £1,000</option>
                      <option value="over-1000">Over £1,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What are your primary business goals? (Select all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {businessGoals.map((goal) => (
                        <label key={goal} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.primaryGoals.includes(goal)}
                            onChange={() => handleArrayInputChange('primaryGoals', goal)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      value={formData.hearAboutUs}
                      onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Please select</option>
                      <option value="google-search">Google search</option>
                      <option value="social-media">Social media</option>
                      <option value="word-of-mouth">Word of mouth</option>
                      <option value="local-advertising">Local advertising</option>
                      <option value="business-networking">Business networking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose your package</h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Premium Package */}
                  <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    formData.preferredTier === 'premium' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleInputChange('preferredTier', 'premium')}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Premium</h3>
                      <input
                        type="radio"
                        name="tier"
                        value="premium"
                        checked={formData.preferredTier === 'premium'}
                        onChange={(e) => handleInputChange('preferredTier', e.target.value)}
                        className="text-blue-600"
                      />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">£25</div>
                    <div className="text-sm text-gray-500 mb-4">per month</div>
                    <div className="text-xs text-green-600 font-medium mb-4 bg-green-100 px-2 py-1 rounded">
                      Save £25/month vs LiveLocalAds
                    </div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Premium digital listing
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        AI-enhanced content
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Unlimited photos
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Analytics dashboard
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Review management
                      </li>
                    </ul>
                  </div>

                  {/* Professional Package */}
                  <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative ${
                    formData.preferredTier === 'professional' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleInputChange('preferredTier', 'professional')}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Professional</h3>
                      <input
                        type="radio"
                        name="tier"
                        value="professional"
                        checked={formData.preferredTier === 'professional'}
                        onChange={(e) => handleInputChange('preferredTier', e.target.value)}
                        className="text-blue-600"
                      />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">£65</div>
                    <div className="text-sm text-gray-500 mb-4">per month</div>
                    <div className="text-xs text-green-600 font-medium mb-4 bg-green-100 px-2 py-1 rounded">
                      Everything in Premium PLUS:
                    </div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Monthly leaflet campaigns
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        AI-powered design
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Geographic targeting
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Campaign analytics
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Priority support
                      </li>
                    </ul>
                  </div>

                  {/* Enterprise Package */}
                  <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    formData.preferredTier === 'enterprise' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleInputChange('preferredTier', 'enterprise')}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
                      <input
                        type="radio"
                        name="tier"
                        value="enterprise"
                        checked={formData.preferredTier === 'enterprise'}
                        onChange={(e) => handleInputChange('preferredTier', e.target.value)}
                        className="text-blue-600"
                      />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">£150</div>
                    <div className="text-sm text-gray-500 mb-4">per month</div>
                    <div className="text-xs text-blue-600 font-medium mb-4 bg-blue-100 px-2 py-1 rounded">
                      Everything in Professional PLUS:
                    </div>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Multi-location management
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Custom branding
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        API access
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        Dedicated account manager
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        White-label options
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional requirements or questions
                  </label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Tell us about any specific needs, questions, or goals you have..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              ) : <div></div>}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.businessName || !formData.contactName || !formData.email || !formData.phone || !formData.businessType || !formData.address))
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Get Started Today!'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Wellingborough businesses choose us
            </h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <BoltIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Fast Setup</h4>
              <p className="text-sm text-gray-600">Get online in 24 hours, not weeks</p>
            </div>
            
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Proven Results</h4>
              <p className="text-sm text-gray-600">Track every click, call, and conversion</p>
            </div>
            
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Local Focus</h4>
              <p className="text-sm text-gray-600">Built specifically for Wellingborough</p>
            </div>
            
            <div className="text-center">
              <ShieldCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">No Lock-In</h4>
              <p className="text-sm text-gray-600">Cancel anytime, no long-term contracts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 