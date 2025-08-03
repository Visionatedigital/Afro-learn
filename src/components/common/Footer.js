import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import playStoreBadge from '../../assets/images/google-play.png';

const Footer = () => (
  <footer className="afrolearn-footer">
    <div className="footer-top">
      <div className="footer-mission">
        <h3>Our mission is to empower every African child with culturally relevant, world-class education and life skills.</h3>
        <p>
          AfroLearn is a nonprofit initiative. Support us by <a href="/join" className="footer-link">joining</a>, <a href="/volunteer" className="footer-link">volunteering</a>, or <a href="/donate" className="footer-link">donating</a>.
        </p>
      </div>
      {/* Removed child image and motif bubble */}
    </div>
    <div className="footer-middle">
      <div className="footer-col">
        <h4>About</h4>
        <ul>
          <li><a href="/about">Our Story</a></li>
          <li><a href="/team">Our Team</a></li>
          <li><a href="/impact">Impact</a></li>
          <li><a href="/partners">Partners</a></li>
          <li><a href="/careers">Careers</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="/help">Help Center</a></li>
          <li><a href="/community">Support Community</a></li>
          <li><a href="/press">Press</a></li>
          <li><a href="/volunteer">Volunteer</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Courses</h4>
        <ul>
          <li><a href="/courses">Explore Courses</a></li>
          <li><a href="/life-skills">Life Skills</a></li>
          <li><a href="/culturally-relevant">Culturally Relevant Learning</a></li>
          <li><a href="/ai-education">AI-Powered Education</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Community</h4>
        <ul>
          <li><a href="/blog">Blog/Stories</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/join-teacher">Join as Teacher</a></li>
          <li><a href="/join-parent">Join as Parent</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-app-social">
      <div className="footer-apps">
        <a href="https://play.google.com/store" className="app-btn playstore" target="_blank" rel="noopener noreferrer">
          <img src={playStoreBadge} alt="Google Play" style={{ height: 40 }} />
        </a>
      </div>
      <div className="footer-social">
        <a href="https://facebook.com" aria-label="Facebook" className="footer-social-icon" target="_blank" rel="noopener noreferrer"><FaFacebook size={22} /></a>
        <a href="https://twitter.com" aria-label="Twitter" className="footer-social-icon" target="_blank" rel="noopener noreferrer"><FaTwitter size={22} /></a>
        <a href="https://instagram.com" aria-label="Instagram" className="footer-social-icon" target="_blank" rel="noopener noreferrer"><FaInstagram size={22} /></a>
        <a href="https://wa.me/" aria-label="WhatsApp" className="footer-social-icon" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={22} /></a>
      </div>
      <div className="footer-lang-country">
        <select aria-label="Language">
          <option>English</option>
          <option>Swahili</option>
          <option>French</option>
        </select>
        <select aria-label="Country">
          <option>Kenya</option>
          <option>Nigeria</option>
          <option>South Africa</option>
          <option>Ghana</option>
        </select>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 AfroLearn. All rights reserved.</span>
      <a href="/terms">Terms of Use</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/cookies">Cookie Notice</a>
      <a href="/accessibility">Accessibility Statement</a>
    </div>
  </footer>
);

export default Footer; 
 
 
 