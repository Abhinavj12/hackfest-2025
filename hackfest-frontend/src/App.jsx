import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Trophy, Code, Zap, Star, ChevronDown, Menu, X, Mail, Phone, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import './index.css';

const HackathonRegistration = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [registrationForm, setRegistrationForm] = useState({
    teamName: '',
    teamLeader: '',
    email: '',
    phone: '',
    college: '',
    members: ['', '', ''],
    experience: 'beginner',
    track: 'web',
    idea: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [registeredTeams, setRegisteredTeams] = useState([]);

  // Animation states
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (field, value, index = null) => {
    if (field === 'members' && index !== null) {
      const newMembers = [...registrationForm.members];
      newMembers[index] = value;
      setRegistrationForm({ ...registrationForm, members: newMembers });
    } else {
      setRegistrationForm({ ...registrationForm, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  // Filter out empty team member names
  const cleanedForm = {
    ...registrationForm,
    members: registrationForm.members.filter(m => m.trim() !== '')
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedForm),
    });

    if (response.ok) {
      const result = await response.json();
      setSubmitStatus({ type: 'success', message: 'Registration successful! Check your email for confirmation.' });
      setRegistrationForm({
        teamName: '',
        teamLeader: '',
        email: '',
        phone: '',
        college: '',
        members: ['', '', ''],
        experience: 'beginner',
        track: 'web',
        idea: ''
      });
      fetchRegisteredTeams();
    } else {
      const error = await response.json();
      setSubmitStatus({ type: 'error', message: error.message || 'Registration failed. Please try again.' });
    }
  } catch (error) {
    setSubmitStatus({ type: 'error', message: 'Registration failed. Please try again.' });
  } finally {
    setIsSubmitting(false);
  }
};



  const fetchRegisteredTeams = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`);
    if (response.ok) {
      const data = await response.json();
      setRegisteredTeams(data);
    }
  } catch (error) {
    console.error('Failed to fetch teams:', error);
  }
};


  useEffect(() => {
    fetchRegisteredTeams();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const tracks = [
    { id: 'web', name: 'Web Development', icon: Code, color: 'from-blue-500 to-purple-600' },
    { id: 'mobile', name: 'Mobile App', icon: Zap, color: 'from-green-500 to-blue-500' },
    { id: 'ai', name: 'AI/ML', icon: Star, color: 'from-purple-500 to-pink-500' },
    { id: 'blockchain', name: 'Blockchain', icon: Trophy, color: 'from-orange-500 to-red-500' }
  ];

  const timeline = [
    { time: '09:00 AM', event: 'Registration & Check-in', date: 'Day 1' },
    { time: '10:00 AM', event: 'Opening Ceremony', date: 'Day 1' },
    { time: '11:00 AM', event: 'Hacking Begins!', date: 'Day 1' },
    { time: '02:00 PM', event: 'Lunch Break', date: 'Day 1' },
    { time: '06:00 PM', event: 'Mentor Sessions', date: 'Day 1' },
    { time: '10:00 AM', event: 'Submission Deadline', date: 'Day 2' },
    { time: '11:00 AM', event: 'Presentations', date: 'Day 2' },
    { time: '04:00 PM', event: 'Award Ceremony', date: 'Day 2' }
  ];

  const prizes = [
    { position: '1st Place', amount: '₹50,000', color: 'from-yellow-400 to-orange-500' },
    { position: '2nd Place', amount: '₹30,000', color: 'from-gray-300 to-gray-500' },
    { position: '3rd Place', amount: '₹20,000', color: 'from-orange-400 to-red-500' },
    { position: 'Best Innovation', amount: '₹10,000', color: 'from-purple-400 to-pink-500' }
  ];

  return (
   <div className="min-h-screen w-full bg-gray-900 text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                HackFest 2025
              </span>
            </div>

            {/* Desktop Menu */}
           <div className="hidden md:flex space-x-4">
  {['home', 'about', 'timeline', 'prizes', 'register'].map((section) => (
    <button
      key={section}
      onClick={() => scrollToSection(section)}
      className={`capitalize px-4 py-2 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
        activeSection === section
          ? 'bg-purple-600 text-white shadow-md'
          : 'bg-white/10 text-gray-200 hover:bg-white/20'
      }`}
    >
      {section}
    </button>
  ))}
</div>



            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="className={`block w-full text-left py-3 px-4 capitalize rounded-lg font-medium transition-all duration-300 ${
  activeSection === section
    ? 'bg-purple-600 text-white'
    : 'text-white bg-white/10 hover:bg-white/20'
}`}">
              {['home', 'about', 'timeline', 'prizes', 'register'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left py-2 px-4 capitalize hover:text-purple-400 transition-colors"
                >
                  {section}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center z-10 max-w-4xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible.home ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent animate-pulse">
              HackFest 2025
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              India's Premier College Hackathon
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400 mb-12">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>March 15-16, 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>IIT Delhi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-400" />
                <span>500+ Participants</span>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={() => scrollToSection('register')}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Register Now
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              About HackFest
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Join India's most exciting college hackathon where innovation meets creativity. 
              Build groundbreaking solutions, network with industry experts, and compete for amazing prizes!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${track.color} p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative z-10">
                    <Icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">{track.name}</h3>
                    <p className="text-white/80 text-sm">
                      Build innovative solutions in {track.name.toLowerCase()} technology
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.timeline ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Event Timeline
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center justify-center mb-8 transform transition-all duration-700 ${
                  isVisible.timeline ? 'translate-x-0 opacity-100' : index % 2 === 0 ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 order-2'}`}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-sm font-semibold mb-2 mx-auto">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-lg text-purple-400 mb-1">{item.event}</h3>
                    <p className="text-gray-300">{item.time}</p>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-gray-900"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.prizes ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Prizes & Rewards
            </h2>
            <p className="text-xl text-gray-300">Amazing prizes worth over ₹1,10,000!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className={`relative group transform transition-all duration-700 hover:scale-105 ${
                  isVisible.prizes ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`bg-gradient-to-br ${prize.color} p-6 rounded-xl text-center relative overflow-hidden`}>
                  <div className="relative z-10">
                    <Trophy className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{prize.position}</h3>
                    <p className="text-2xl font-bold text-white">{prize.amount}</p>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.register ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Register Your Team
            </h2>
            <p className="text-xl text-gray-300">Join the innovation revolution!</p>
            <div className="mt-4 text-green-400 font-semibold">
              {registeredTeams.length} teams registered so far!
            </div>
          </div>

          <div className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transform transition-all duration-1000 ${isVisible.register ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                submitStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {submitStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationForm.teamName}
                    onChange={(e) => handleInputChange('teamName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Enter your team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Team Leader *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationForm.teamLeader}
                    onChange={(e) => handleInputChange('teamLeader', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Team leader name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={registrationForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="team@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={registrationForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  College/University *
                </label>
                <input
                  type="text"
                  required
                  value={registrationForm.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter your college name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Team Members (Max 4 total including leader)
                </label>
                {registrationForm.members.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    value={member}
                    onChange={(e) => handleInputChange('members', e.target.value, index)}
                    className="w-full px-4 py-3 mb-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    placeholder={`Member ${index + 2} name (optional)`}
                  />
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Experience Level *
                  </label>
                  <select
                    required
                    value={registrationForm.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Preferred Track *
                  </label>
                  <select
                    required
                    value={registrationForm.track}
                    onChange={(e) => handleInputChange('track', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                  >
                    {tracks.map((track) => (
                      <option key={track.id} value={track.id}>
                        {track.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Project Idea (Optional)
                </label>
                <textarea
                  value={registrationForm.idea}
                  onChange={(e) => handleInputChange('idea', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 resize-none"
                  placeholder="Brief description of your project idea..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register Team'}
              </button>
            </form>
          </div>

          {/* Registered Teams Counter */}
          {registeredTeams.length > 0 && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 bg-gray-800/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">
                  {registeredTeams.length} teams registered and counting!
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              HackFest 2025
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            Building the future, one hack at a time.
          </p>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>contact@hackfest2025.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              © 2025 HackFest. All rights reserved. | Built with ❤️ for innovation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HackathonRegistration;