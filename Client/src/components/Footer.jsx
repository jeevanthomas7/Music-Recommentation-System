import React from "react";
import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full text-gray-600 border-t border-blue-100 ">
      <div className="max-w-[1600px] mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-12">

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-600 cursor-pointer transition">About</li>
              <li className="hover:text-blue-600 cursor-pointer transition">Jobs</li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                For the Record
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Communities</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-600 cursor-pointer transition">
                For Artists
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Developers
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition">
                Advertising
              </li>
          
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-600 transition"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-600 transition"
                >
                  Web Player
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-600 transition"
                >
                  Free Mobile App
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-white text-gray-500 flex items-center justify-center shadow-sm hover:bg-blue-100 hover:text-blue-600 transition"
            >
              <FiInstagram className="text-lg" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-white text-gray-500 flex items-center justify-center shadow-sm hover:bg-blue-100 hover:text-blue-600 transition"
            >
              <FiTwitter className="text-lg" />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-white text-gray-500 flex items-center justify-center shadow-sm hover:bg-blue-100 hover:text-blue-600 transition"
            >
              <FiFacebook className="text-lg" />
            </a>
          </div>
        </div>

        <div className="border-t border-blue-100 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">
            © 2025 DotIn. All rights reserved.
          </span>

          <div className="flex gap-5">
            <span className="hover:text-blue-600 cursor-pointer transition">
              Privacy
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition">
              Terms
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition">
              Cookies
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
