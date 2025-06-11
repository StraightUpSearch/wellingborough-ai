import Link from 'next/link'
import { 
  CheckCircleIcon, 
  ChartBarIcon, 
  MapPinIcon, 
  CurrencyPoundIcon,
  ArrowRightIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export function BusinessSignupCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center text-white mb-12">
          <div className="inline-flex items-center bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Limited Time: Save £25/month vs LiveLocalAds
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your Business <span className="text-yellow-300">Found</span> Online
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Premium digital listing + monthly leaflet campaigns that actually work. 
            <strong className="text-white"> No long-term contracts.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              href="/business-signup"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-200 flex items-center shadow-lg"
            >
              Get Started Today
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            
            <div className="text-blue-100 text-sm">
              ✓ Free setup in 24 hours<br/>
              ✓ Cancel anytime
            </div>
          </div>
        </div>

        {/* Competitive Comparison */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-12">
          <h3 className="text-xl font-semibold text-yellow-300 mb-6 text-center">
            💰 Why Switch from LiveLocalAds?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-red-200 mb-4 flex items-center">
                ❌ LiveLocalAds (Old Way)
              </h4>
              <ul className="space-y-2 text-red-100">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  £150 minimum (3 months upfront)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Print only, no digital presence
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  No performance tracking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  £45 per 1,000 leaflets
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Design costs extra (£25+)
                </li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-green-200 mb-4 flex items-center">
                ✅ Wellingborough.ai (Smart Way)
              </h4>
              <ul className="space-y-2 text-green-100">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-3" />
                  £25/month (no contract required)
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-3" />
                  Premium digital + leaflet campaigns
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-3" />
                  Real-time analytics & ROI tracking
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-3" />
                  £35 per 1,000 leaflets (22% savings)
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-3" />
                  AI-powered design included FREE
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <div className="inline-flex items-center bg-green-500 text-white px-6 py-2 rounded-full text-lg font-bold">
              <CurrencyPoundIcon className="h-5 w-5 mr-2" />
              Save £300+ per year
            </div>
          </div>
        </div>

        {/* Package Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Premium</h4>
            <div className="text-3xl font-bold text-yellow-300 mb-4">£25<span className="text-base">/month</span></div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Premium digital listing
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                AI-enhanced content
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Analytics dashboard
              </li>
            </ul>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-6 text-white border-2 border-yellow-400 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2">Professional</h4>
            <div className="text-3xl font-bold text-yellow-300 mb-4">£65<span className="text-base">/month</span></div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Everything in Premium
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Monthly leaflet campaigns
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                AI-powered design
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Enterprise</h4>
            <div className="text-3xl font-bold text-yellow-300 mb-4">£150<span className="text-base">/month</span></div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Everything in Professional
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Multi-location support
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                Dedicated manager
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid md:grid-cols-4 gap-6 text-center text-white">
          <div>
            <ChartBarIcon className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h5 className="font-semibold">Proven Results</h5>
            <p className="text-sm text-blue-100">Track every click & call</p>
          </div>
          
          <div>
            <MapPinIcon className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h5 className="font-semibold">Local Focus</h5>
            <p className="text-sm text-blue-100">Built for Wellingborough</p>
          </div>
          
          <div>
            <StarIcon className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h5 className="font-semibold">Fast Setup</h5>
            <p className="text-sm text-blue-100">Online in 24 hours</p>
          </div>
          
          <div>
            <CheckCircleIcon className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h5 className="font-semibold">No Lock-In</h5>
            <p className="text-sm text-blue-100">Cancel anytime</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/business-signup"
            className="inline-flex items-center bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition-all duration-200 shadow-xl"
          >
            Get Your Free Quote
            <ArrowRightIcon className="h-6 w-6 ml-2" />
          </Link>
          
          <p className="text-blue-100 text-sm mt-4">
            Setup takes 2 minutes • We'll call you within 24 hours • No hidden fees
          </p>
        </div>
      </div>
    </section>
  )
} 