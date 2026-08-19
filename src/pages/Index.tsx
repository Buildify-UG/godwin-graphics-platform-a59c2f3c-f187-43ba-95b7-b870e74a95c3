import { useState, useEffect } from 'react';
import { Play, Lock, Download, Check, Menu, X, Zap, Users, BarChart3 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: 'free' | 'paid';
  price?: number;
  instructor: string;
  duration: string;
  modules: number;
  thumbnail: string;
  description: string;
}

interface UnlockedCourse {
  courseId: string;
  unlockedAt: string;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'learning'>('courses');
  const [unlockedCourses, setUnlockedCourses] = useState<UnlockedCourse[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const courses: Course[] = [
    {
      id: '1',
      title: 'Adobe Photoshop Retouching Masterclass',
      category: 'paid',
      price: 18000,
      instructor: 'Godwin',
      duration: '12 weeks',
      modules: 24,
      thumbnail: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
      description: 'Master professional photo retouching techniques',
    },
    {
      id: '2',
      title: 'Brand Identity Design Fundamentals',
      category: 'paid',
      price: 15000,
      instructor: 'Godwin',
      duration: '8 weeks',
      modules: 16,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      description: 'Create stunning brand identities from scratch',
    },
    {
      id: '3',
      title: 'Mobile Flyer Design Workshop',
      category: 'paid',
      price: 20000,
      instructor: 'Godwin',
      duration: '6 weeks',
      modules: 12,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      description: 'Design eye-catching mobile flyers',
    },
    {
      id: '4',
      title: 'Lightroom Color Science Basics',
      category: 'free',
      instructor: 'Godwin',
      duration: '4 weeks',
      modules: 8,
      thumbnail: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
      description: 'Understand color grading fundamentals',
    },
  ];

  // PWA Installation
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    }
  };

  const handleEnroll = (course: Course) => {
    if (course.category === 'free') {
      setUnlockedCourses([
        ...unlockedCourses,
        { courseId: course.id, unlockedAt: new Date().toISOString() },
      ]);
      setPlayingCourse(course);
      setActiveTab('learning');
    } else {
      setSelectedCourse(course);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse && paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.name) {
      setUnlockedCourses([
        ...unlockedCourses,
        { courseId: selectedCourse.id, unlockedAt: new Date().toISOString() },
      ]);
      setShowPaymentModal(false);
      setPlayingCourse(selectedCourse);
      setActiveTab('learning');
      setPaymentData({ cardNumber: '', expiryDate: '', cvv: '', name: '' });
    }
  };

  const isCourseLocked = (courseId: string) => !unlockedCourses.find((u) => u.courseId === courseId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Install Banner */}
      {installPrompt && !isInstalled && (
        <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between z-50 shadow-lg">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span className="text-sm font-medium">Install Godwin Graphics App</span>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-primary-foreground text-primary px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition"
          >
            Install
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-card z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              GG
            </div>
            <h1 className="text-2xl font-bold hidden sm:block">Godwin Graphics</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`font-medium transition ${
                activeTab === 'courses'
                  ? 'text-primary border-b-2 border-primary pb-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`font-medium transition ${
                activeTab === 'learning'
                  ? 'text-primary border-b-2 border-primary pb-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Learning
            </button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <button
              onClick={() => {
                setActiveTab('courses');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-secondary font-medium"
            >
              Courses
            </button>
            <button
              onClick={() => {
                setActiveTab('learning');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-secondary font-medium"
            >
              My Learning
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'courses' && (
          <div>
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Welcome to Godwin Graphics</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Master professional graphic design and photo retouching with industry experts
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Active Learners</span>
                  </div>
                  <p className="text-3xl font-bold">2,500+</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">Courses</span>
                  </div>
                  <p className="text-3xl font-bold">4</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">Completion Rate</span>
                  </div>
                  <p className="text-3xl font-bold">94%</p>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => {
                const isLocked = isCourseLocked(course.id);
                return (
                  <div
                    key={course.id}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-48 overflow-hidden bg-secondary">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                      {isLocked && course.category === 'paid' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        {course.category === 'free' && (
                          <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                            Free
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{course.description}</p>

                      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Instructor</p>
                          <p className="font-semibold">{course.instructor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold">{course.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Modules</p>
                          <p className="font-semibold">{course.modules}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnroll(course)}
                        className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                          isLocked && course.category === 'paid'
                            ? 'bg-primary text-primary-foreground hover:opacity-90'
                            : 'bg-accent text-accent-foreground hover:opacity-90'
                        }`}
                      >
                        {!isLocked ? (
                          <>
                            <Play className="w-4 h-4" />
                            Start Learning
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Enroll (₦{course.price?.toLocaleString()})
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            {playingCourse ? (
              <div className="space-y-8">
                {/* Video Player */}
                <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-white mx-auto mb-4 opacity-50" />
                    <p className="text-white text-lg font-semibold">{playingCourse.title}</p>
                    <p className="text-gray-400 text-sm mt-2">Video player simulation</p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-4">{playingCourse.title}</h2>
                    <p className="text-muted-foreground text-lg mb-6">{playingCourse.description}</p>

                    <div className="bg-card border border-border rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">Course Modules</h3>
                      <div className="space-y-3">
                        {Array.from({ length: playingCourse.modules }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition cursor-pointer"
                          >
                            <Check className="w-5 h-5 text-accent" />
                            <div>
                              <p className="font-semibold">Module {i + 1}</p>
                              <p className="text-sm text-muted-foreground">45 min • Beginner</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                      <h3 className="font-bold mb-4">Course Details</h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Instructor</p>
                          <p className="font-semibold">{playingCourse.instructor}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Duration</p>
                          <p className="font-semibold">{playingCourse.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Total Modules</p>
                          <p className="font-semibold">{playingCourse.modules}</p>
                        </div>
                        <button
                          onClick={() => setPlayingCourse(null)}
                          className="w-full mt-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-semibold transition"
                        >
                          Back to Courses
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Course Selected</h3>
                <p className="text-muted-foreground mb-8">Enroll in a course to start learning</p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-muted-foreground text-sm mb-2">Course</p>
              <p className="font-bold mb-2">{selectedCourse.title}</p>
              <p className="text-2xl font-bold text-primary">₦{selectedCourse.price?.toLocaleString()}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentData.name}
                  onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                ⚠️ This is a simulation. No real payments are processed.
              </p>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                Complete Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
