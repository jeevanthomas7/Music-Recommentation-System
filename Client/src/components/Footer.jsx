import React from "react";
import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      className="
        w-full bg-white text-gray-500
        border-t border-gray-200
        shadow-[0_-6px_20px_rgba(0,0,0,0.04)]
      "
    >
      <div className="max-w-[1600px] mx-auto">
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
            gap-10
            px-6 py-12
          "
        >
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-600 cursor-pointer">About</li>
              <li className="hover:text-emerald-600 cursor-pointer">Jobs</li>
              <li className="hover:text-emerald-600 cursor-pointer">
                For the Record
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Communities</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-600 cursor-pointer">
                For Artists
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Developers
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Advertising
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Investors
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-600 cursor-pointer">Support</li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Web Player
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Free Mobile App
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-4 sm:justify-start">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <button
                key={i}
                className="
                  w-10 h-10 rounded-full
                  bg-gray-100 text-gray-500
                  flex items-center justify-center
                  hover:bg-emerald-100 hover:text-emerald-600
                  shadow-sm hover:shadow-md
                  transition
                "
              >
                <Icon className="text-lg" />
              </button>
            ))}
          </div>
        </div>

        <div
          className="
            border-t border-gray-200
            px-6 py-6
            text-sm
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
          "
        >
          <span>© 2025 DotIn. All rights reserved.</span>

          <div className="flex gap-4">
            <span className="hover:text-emerald-600 cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-emerald-600 cursor-pointer">Terms</span>
            <span className="hover:text-emerald-600 cursor-pointer">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
