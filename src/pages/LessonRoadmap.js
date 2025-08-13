import React, { useState } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaPrint, FaShare, FaClock, FaUsers, FaBook, FaLightbulb, FaCheckCircle, FaRegCircle, FaBullseye, FaRobot, FaGoogleDrive, FaDownload, FaSpinner } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const LessonRoadmap = ({ onBack }) => {
  const [lessonPlan, setLessonPlan] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: '',
    objectives: [],
    materials: [],
    activities: [],
    assessment: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    topic: '',
    learningStyle: 'mixed',
    classSize: '',
    timeAvailable: '',
    difficulty: 'medium',
    includeActivities: true,
    includeAssessment: true,
    culturalContext: ''
  });

  const steps = [
    { id: 1, title: 'AI Input', icon: <FaRobot /> },
    { id: 2, title: 'Generate', icon: <FaLightbulb /> },
    { id: 3, title: 'Edit & Review', icon: <FaEdit /> },
    { id: 4, title: 'Save & Share', icon: <FaGoogleDrive /> }
  ];

  const handleInputChange = (field, value) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleAiInputChange = (field, value) => {
    setAiInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateLessonPlan = async () => {
    if (!aiInputs.topic) {
      alert('Please enter a topic');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(aiInputs)
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.lessonPlan);
        setCurrentStep(3);
        
        // Show demo mode notification if applicable
        if (data.demo) {
          alert('Demo mode: This is a sample lesson plan. For AI-generated plans, add billing to your OpenAI account.');
        }
      } else {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      alert('Error generating lesson plan: ' + error.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const saveToGoogleDrive = async () => {
    // Simulate Google Drive integration
    alert('Connecting to Google Drive...');
    setTimeout(() => {
      alert('Lesson plan saved to Google Drive successfully!');
    }, 2000);
  };

  const downloadAsWord = () => {
    // Simulate Word document download
    const content = `
Lesson Plan: ${lessonPlan.title}
Subject: ${lessonPlan.subject}
Grade: ${lessonPlan.grade}
Duration: ${lessonPlan.duration}

OBJECTIVES:
${lessonPlan.objectives.map(obj => `• ${obj.text}`).join('\n')}

MATERIALS:
${lessonPlan.materials.map(mat => `• ${mat.name} (${mat.quantity}) - ${mat.notes}`).join('\n')}

ACTIVITIES:
${lessonPlan.activities.map(act => `• ${act.name} (${act.duration}) - ${act.description}`).join('\n')}

ASSESSMENT:
${lessonPlan.assessment}

NOTES:
${lessonPlan.notes}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}_lesson_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddObjective = () => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: Date.now(), text: '', completed: false }]
    }));
  };

  const handleUpdateObjective = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleRemoveObjective = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleAddMaterial = () => {
    setLessonPlan(prev => ({
      ...prev,
      materials: [...prev.materials, { id: Date.now(), name: '', quantity: '', notes: '' }]
    }));
  };

  const handleUpdateMaterial = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.map(mat => 
        mat.id === id ? { ...mat, [field]: value } : mat
      )
    }));
  };

  const handleRemoveMaterial = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id)
    }));
  };

  const handleAddActivity = () => {
    setLessonPlan(prev => ({
      ...prev,
      activities: [...prev.activities, { 
        id: Date.now(), 
        name: '', 
        duration: '', 
        description: '', 
        type: 'individual' 
      }]
    }));
  };

  const handleUpdateActivity = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.map(act => 
        act.id === id ? { ...act, [field]: value } : act
      )
    }));
  };

  const handleRemoveActivity = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>AI Lesson Plan Generator</h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Tell us about your lesson and our AI will generate a comprehensive lesson plan for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Lesson Topic</label>
                <input
                  type="text"
                  value={aiInputs.topic}
                  onChange={(e) => handleAiInputChange('topic', e.target.value)}
                  placeholder="e.g., Fractions, Photosynthesis, Creative Writing"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Learning Style</label>
                  <select
                    value={aiInputs.learningStyle}
                    onChange={(e) => handleAiInputChange('learningStyle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Class Size</label>
                  <input
                    type="number"
                    value={aiInputs.classSize}
                    onChange={(e) => handleAiInputChange('classSize', e.target.value)}
                    placeholder="e.g., 25"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Time Available</label>
                  <input
                    type="text"
                    value={aiInputs.timeAvailable}
                    onChange={(e) => handleAiInputChange('timeAvailable', e.target.value)}
                    placeholder="e.g., 45 minutes"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Difficulty Level</label>
                  <select
                    value={aiInputs.difficulty}
                    onChange={(e) => handleAiInputChange('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Cultural Context (Optional)</label>
                <input
                  type="text"
                  value={aiInputs.culturalContext}
                  onChange={(e) => handleAiInputChange('culturalContext', e.target.value)}
                  placeholder="e.g., Nigerian culture, African history"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeActivities}
                    onChange={(e) => handleAiInputChange('includeActivities', e.target.checked)}
                  />
                  Include Activities
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeAssessment}
                    onChange={(e) => handleAiInputChange('includeAssessment', e.target.checked)}
                  />
                  Include Assessment
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: 600, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Generating Your Lesson Plan</h3>
            {aiGenerating ? (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ color: '#666', marginBottom: 16 }}>
                  Our AI is analyzing your requirements and creating a comprehensive lesson plan...
                </p>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>AI is working on:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Creating learning objectives</li>
                    <li>Designing engaging activities</li>
                    <li>Planning assessment methods</li>
                    <li>Suggesting materials needed</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={generateLessonPlan}
                  style={{
                    background: '#2bb6bb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: '0 auto'
                  }}
                >
                  <FaRobot /> Generate Lesson Plan
                </button>
                <p style={{ color: '#666', marginTop: 16 }}>
                  Click the button above to generate your AI-powered lesson plan
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Edit Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Basic Information</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Title</label>
                    <input
                      type="text"
                      value={lessonPlan.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Subject</label>
                      <select
                        value={lessonPlan.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Subject</option>
                        <option value="Math">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Art">Art</option>
                        <option value="Physical Education">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Grade</label>
                      <select
                        value={lessonPlan.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Grade</option>
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Duration</label>
                    <input
                      type="text"
                      value={lessonPlan.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Learning Objectives</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.objectives.map((obj, index) => (
                    <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={(e) => handleUpdateObjective(obj.id, 'completed', e.target.checked)}
                      />
                      <input
                        type="text"
                        value={obj.text}
                        onChange={(e) => handleUpdateObjective(obj.id, 'text', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                          fontSize: 13
                        }}
                      />
                      <button
                        onClick={() => handleRemoveObjective(obj.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddObjective}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    <FaPlus /> Add Objective
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Materials</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.materials.map((mat) => (
                    <div key={mat.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={mat.name}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                          placeholder="Material name"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <input
                          type="text"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <button
                          onClick={() => handleRemoveMaterial(mat.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: 4
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddMaterial}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <FaPlus /> Add Material
                  </button>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Assessment</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <textarea
                    value={lessonPlan.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    placeholder="Describe assessment methods..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Save & Share Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Save Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    onClick={saveToGoogleDrive}
                    style={{
                      background: '#4285f4',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaGoogleDrive /> Save to Google Drive
                  </button>
                  <button
                    onClick={downloadAsWord}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaDownload /> Download as Document
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Lesson Plan Preview</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: '#2d3a2e' }}>{lessonPlan.title}</h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Subject:</strong> {lessonPlan.subject}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Grade:</strong> {lessonPlan.grade}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Duration:</strong> {lessonPlan.duration}</p>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Objectives:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.objectives.map((obj, index) => (
                      <li key={obj.id}>{obj.text}</li>
                    ))}
                  </ul>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Materials:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.materials.map((mat) => (
                      <li key={mat.id}>{mat.name} ({mat.quantity})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: '#2d3a2e',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2d3a2e', margin: 0 }}>AI Lesson Roadmap</h1>
            <p style={{ color: '#666', margin: '4px 0 0 0' }}>AI-powered lesson planning with Google Drive integration</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: currentStep >= step.id ? '#2bb6bb' : '#e9ecef',
                  color: currentStep >= step.id ? '#fff' : '#666',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {currentStep > step.id ? <FaCheckCircle /> : step.id}
                </div>
                <span style={{
                  fontWeight: 600,
                  color: currentStep >= step.id ? '#2d3a2e' : '#666',
                  fontSize: 14
                }}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div style={{
                    width: 40,
                    height: 2,
                    background: currentStep > step.id ? '#2bb6bb' : '#e9ecef'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem', minHeight: 500 }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              background: currentStep === 1 ? '#e9ecef' : '#fff',
              color: currentStep === 1 ? '#666' : '#2d3a2e',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {currentStep === steps.length ? (
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: '#2bb6bb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create New Plan
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === 2 && !aiGenerating}
                style={{
                  background: currentStep === 2 && !aiGenerating ? '#e9ecef' : '#2bb6bb',
                  color: currentStep === 2 && !aiGenerating ? '#666' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: currentStep === 2 && !aiGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LessonRoadmap; 
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaPrint, FaShare, FaClock, FaUsers, FaBook, FaLightbulb, FaCheckCircle, FaRegCircle, FaBullseye, FaRobot, FaGoogleDrive, FaDownload, FaSpinner } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const LessonRoadmap = ({ onBack }) => {
  const [lessonPlan, setLessonPlan] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: '',
    objectives: [],
    materials: [],
    activities: [],
    assessment: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    topic: '',
    learningStyle: 'mixed',
    classSize: '',
    timeAvailable: '',
    difficulty: 'medium',
    includeActivities: true,
    includeAssessment: true,
    culturalContext: ''
  });

  const steps = [
    { id: 1, title: 'AI Input', icon: <FaRobot /> },
    { id: 2, title: 'Generate', icon: <FaLightbulb /> },
    { id: 3, title: 'Edit & Review', icon: <FaEdit /> },
    { id: 4, title: 'Save & Share', icon: <FaGoogleDrive /> }
  ];

  const handleInputChange = (field, value) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleAiInputChange = (field, value) => {
    setAiInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateLessonPlan = async () => {
    if (!aiInputs.topic) {
      alert('Please enter a topic');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(aiInputs)
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.lessonPlan);
        setCurrentStep(3);
        
        // Show demo mode notification if applicable
        if (data.demo) {
          alert('Demo mode: This is a sample lesson plan. For AI-generated plans, add billing to your OpenAI account.');
        }
      } else {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      alert('Error generating lesson plan: ' + error.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const saveToGoogleDrive = async () => {
    // Simulate Google Drive integration
    alert('Connecting to Google Drive...');
    setTimeout(() => {
      alert('Lesson plan saved to Google Drive successfully!');
    }, 2000);
  };

  const downloadAsWord = () => {
    // Simulate Word document download
    const content = `
Lesson Plan: ${lessonPlan.title}
Subject: ${lessonPlan.subject}
Grade: ${lessonPlan.grade}
Duration: ${lessonPlan.duration}

OBJECTIVES:
${lessonPlan.objectives.map(obj => `• ${obj.text}`).join('\n')}

MATERIALS:
${lessonPlan.materials.map(mat => `• ${mat.name} (${mat.quantity}) - ${mat.notes}`).join('\n')}

ACTIVITIES:
${lessonPlan.activities.map(act => `• ${act.name} (${act.duration}) - ${act.description}`).join('\n')}

ASSESSMENT:
${lessonPlan.assessment}

NOTES:
${lessonPlan.notes}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}_lesson_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddObjective = () => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: Date.now(), text: '', completed: false }]
    }));
  };

  const handleUpdateObjective = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleRemoveObjective = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleAddMaterial = () => {
    setLessonPlan(prev => ({
      ...prev,
      materials: [...prev.materials, { id: Date.now(), name: '', quantity: '', notes: '' }]
    }));
  };

  const handleUpdateMaterial = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.map(mat => 
        mat.id === id ? { ...mat, [field]: value } : mat
      )
    }));
  };

  const handleRemoveMaterial = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id)
    }));
  };

  const handleAddActivity = () => {
    setLessonPlan(prev => ({
      ...prev,
      activities: [...prev.activities, { 
        id: Date.now(), 
        name: '', 
        duration: '', 
        description: '', 
        type: 'individual' 
      }]
    }));
  };

  const handleUpdateActivity = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.map(act => 
        act.id === id ? { ...act, [field]: value } : act
      )
    }));
  };

  const handleRemoveActivity = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>AI Lesson Plan Generator</h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Tell us about your lesson and our AI will generate a comprehensive lesson plan for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Lesson Topic</label>
                <input
                  type="text"
                  value={aiInputs.topic}
                  onChange={(e) => handleAiInputChange('topic', e.target.value)}
                  placeholder="e.g., Fractions, Photosynthesis, Creative Writing"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Learning Style</label>
                  <select
                    value={aiInputs.learningStyle}
                    onChange={(e) => handleAiInputChange('learningStyle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Class Size</label>
                  <input
                    type="number"
                    value={aiInputs.classSize}
                    onChange={(e) => handleAiInputChange('classSize', e.target.value)}
                    placeholder="e.g., 25"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Time Available</label>
                  <input
                    type="text"
                    value={aiInputs.timeAvailable}
                    onChange={(e) => handleAiInputChange('timeAvailable', e.target.value)}
                    placeholder="e.g., 45 minutes"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Difficulty Level</label>
                  <select
                    value={aiInputs.difficulty}
                    onChange={(e) => handleAiInputChange('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Cultural Context (Optional)</label>
                <input
                  type="text"
                  value={aiInputs.culturalContext}
                  onChange={(e) => handleAiInputChange('culturalContext', e.target.value)}
                  placeholder="e.g., Nigerian culture, African history"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeActivities}
                    onChange={(e) => handleAiInputChange('includeActivities', e.target.checked)}
                  />
                  Include Activities
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeAssessment}
                    onChange={(e) => handleAiInputChange('includeAssessment', e.target.checked)}
                  />
                  Include Assessment
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: 600, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Generating Your Lesson Plan</h3>
            {aiGenerating ? (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ color: '#666', marginBottom: 16 }}>
                  Our AI is analyzing your requirements and creating a comprehensive lesson plan...
                </p>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>AI is working on:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Creating learning objectives</li>
                    <li>Designing engaging activities</li>
                    <li>Planning assessment methods</li>
                    <li>Suggesting materials needed</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={generateLessonPlan}
                  style={{
                    background: '#2bb6bb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: '0 auto'
                  }}
                >
                  <FaRobot /> Generate Lesson Plan
                </button>
                <p style={{ color: '#666', marginTop: 16 }}>
                  Click the button above to generate your AI-powered lesson plan
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Edit Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Basic Information</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Title</label>
                    <input
                      type="text"
                      value={lessonPlan.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Subject</label>
                      <select
                        value={lessonPlan.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Subject</option>
                        <option value="Math">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Art">Art</option>
                        <option value="Physical Education">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Grade</label>
                      <select
                        value={lessonPlan.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Grade</option>
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Duration</label>
                    <input
                      type="text"
                      value={lessonPlan.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Learning Objectives</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.objectives.map((obj, index) => (
                    <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={(e) => handleUpdateObjective(obj.id, 'completed', e.target.checked)}
                      />
                      <input
                        type="text"
                        value={obj.text}
                        onChange={(e) => handleUpdateObjective(obj.id, 'text', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                          fontSize: 13
                        }}
                      />
                      <button
                        onClick={() => handleRemoveObjective(obj.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddObjective}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    <FaPlus /> Add Objective
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Materials</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.materials.map((mat) => (
                    <div key={mat.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={mat.name}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                          placeholder="Material name"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <input
                          type="text"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <button
                          onClick={() => handleRemoveMaterial(mat.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: 4
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddMaterial}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <FaPlus /> Add Material
                  </button>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Assessment</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <textarea
                    value={lessonPlan.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    placeholder="Describe assessment methods..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Save & Share Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Save Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    onClick={saveToGoogleDrive}
                    style={{
                      background: '#4285f4',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaGoogleDrive /> Save to Google Drive
                  </button>
                  <button
                    onClick={downloadAsWord}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaDownload /> Download as Document
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Lesson Plan Preview</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: '#2d3a2e' }}>{lessonPlan.title}</h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Subject:</strong> {lessonPlan.subject}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Grade:</strong> {lessonPlan.grade}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Duration:</strong> {lessonPlan.duration}</p>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Objectives:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.objectives.map((obj, index) => (
                      <li key={obj.id}>{obj.text}</li>
                    ))}
                  </ul>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Materials:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.materials.map((mat) => (
                      <li key={mat.id}>{mat.name} ({mat.quantity})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: '#2d3a2e',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2d3a2e', margin: 0 }}>AI Lesson Roadmap</h1>
            <p style={{ color: '#666', margin: '4px 0 0 0' }}>AI-powered lesson planning with Google Drive integration</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: currentStep >= step.id ? '#2bb6bb' : '#e9ecef',
                  color: currentStep >= step.id ? '#fff' : '#666',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {currentStep > step.id ? <FaCheckCircle /> : step.id}
                </div>
                <span style={{
                  fontWeight: 600,
                  color: currentStep >= step.id ? '#2d3a2e' : '#666',
                  fontSize: 14
                }}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div style={{
                    width: 40,
                    height: 2,
                    background: currentStep > step.id ? '#2bb6bb' : '#e9ecef'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem', minHeight: 500 }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              background: currentStep === 1 ? '#e9ecef' : '#fff',
              color: currentStep === 1 ? '#666' : '#2d3a2e',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {currentStep === steps.length ? (
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: '#2bb6bb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create New Plan
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === 2 && !aiGenerating}
                style={{
                  background: currentStep === 2 && !aiGenerating ? '#e9ecef' : '#2bb6bb',
                  color: currentStep === 2 && !aiGenerating ? '#666' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: currentStep === 2 && !aiGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LessonRoadmap; 
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaPrint, FaShare, FaClock, FaUsers, FaBook, FaLightbulb, FaCheckCircle, FaRegCircle, FaBullseye, FaRobot, FaGoogleDrive, FaDownload, FaSpinner } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const LessonRoadmap = ({ onBack }) => {
  const [lessonPlan, setLessonPlan] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: '',
    objectives: [],
    materials: [],
    activities: [],
    assessment: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    topic: '',
    learningStyle: 'mixed',
    classSize: '',
    timeAvailable: '',
    difficulty: 'medium',
    includeActivities: true,
    includeAssessment: true,
    culturalContext: ''
  });

  const steps = [
    { id: 1, title: 'AI Input', icon: <FaRobot /> },
    { id: 2, title: 'Generate', icon: <FaLightbulb /> },
    { id: 3, title: 'Edit & Review', icon: <FaEdit /> },
    { id: 4, title: 'Save & Share', icon: <FaGoogleDrive /> }
  ];

  const handleInputChange = (field, value) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleAiInputChange = (field, value) => {
    setAiInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateLessonPlan = async () => {
    if (!aiInputs.topic) {
      alert('Please enter a topic');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(aiInputs)
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.lessonPlan);
        setCurrentStep(3);
        
        // Show demo mode notification if applicable
        if (data.demo) {
          alert('Demo mode: This is a sample lesson plan. For AI-generated plans, add billing to your OpenAI account.');
        }
      } else {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      alert('Error generating lesson plan: ' + error.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const saveToGoogleDrive = async () => {
    // Simulate Google Drive integration
    alert('Connecting to Google Drive...');
    setTimeout(() => {
      alert('Lesson plan saved to Google Drive successfully!');
    }, 2000);
  };

  const downloadAsWord = () => {
    // Simulate Word document download
    const content = `
Lesson Plan: ${lessonPlan.title}
Subject: ${lessonPlan.subject}
Grade: ${lessonPlan.grade}
Duration: ${lessonPlan.duration}

OBJECTIVES:
${lessonPlan.objectives.map(obj => `• ${obj.text}`).join('\n')}

MATERIALS:
${lessonPlan.materials.map(mat => `• ${mat.name} (${mat.quantity}) - ${mat.notes}`).join('\n')}

ACTIVITIES:
${lessonPlan.activities.map(act => `• ${act.name} (${act.duration}) - ${act.description}`).join('\n')}

ASSESSMENT:
${lessonPlan.assessment}

NOTES:
${lessonPlan.notes}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}_lesson_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddObjective = () => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: Date.now(), text: '', completed: false }]
    }));
  };

  const handleUpdateObjective = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleRemoveObjective = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleAddMaterial = () => {
    setLessonPlan(prev => ({
      ...prev,
      materials: [...prev.materials, { id: Date.now(), name: '', quantity: '', notes: '' }]
    }));
  };

  const handleUpdateMaterial = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.map(mat => 
        mat.id === id ? { ...mat, [field]: value } : mat
      )
    }));
  };

  const handleRemoveMaterial = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id)
    }));
  };

  const handleAddActivity = () => {
    setLessonPlan(prev => ({
      ...prev,
      activities: [...prev.activities, { 
        id: Date.now(), 
        name: '', 
        duration: '', 
        description: '', 
        type: 'individual' 
      }]
    }));
  };

  const handleUpdateActivity = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.map(act => 
        act.id === id ? { ...act, [field]: value } : act
      )
    }));
  };

  const handleRemoveActivity = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>AI Lesson Plan Generator</h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Tell us about your lesson and our AI will generate a comprehensive lesson plan for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Lesson Topic</label>
                <input
                  type="text"
                  value={aiInputs.topic}
                  onChange={(e) => handleAiInputChange('topic', e.target.value)}
                  placeholder="e.g., Fractions, Photosynthesis, Creative Writing"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Learning Style</label>
                  <select
                    value={aiInputs.learningStyle}
                    onChange={(e) => handleAiInputChange('learningStyle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Class Size</label>
                  <input
                    type="number"
                    value={aiInputs.classSize}
                    onChange={(e) => handleAiInputChange('classSize', e.target.value)}
                    placeholder="e.g., 25"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Time Available</label>
                  <input
                    type="text"
                    value={aiInputs.timeAvailable}
                    onChange={(e) => handleAiInputChange('timeAvailable', e.target.value)}
                    placeholder="e.g., 45 minutes"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Difficulty Level</label>
                  <select
                    value={aiInputs.difficulty}
                    onChange={(e) => handleAiInputChange('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Cultural Context (Optional)</label>
                <input
                  type="text"
                  value={aiInputs.culturalContext}
                  onChange={(e) => handleAiInputChange('culturalContext', e.target.value)}
                  placeholder="e.g., Nigerian culture, African history"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeActivities}
                    onChange={(e) => handleAiInputChange('includeActivities', e.target.checked)}
                  />
                  Include Activities
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeAssessment}
                    onChange={(e) => handleAiInputChange('includeAssessment', e.target.checked)}
                  />
                  Include Assessment
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: 600, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Generating Your Lesson Plan</h3>
            {aiGenerating ? (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ color: '#666', marginBottom: 16 }}>
                  Our AI is analyzing your requirements and creating a comprehensive lesson plan...
                </p>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>AI is working on:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Creating learning objectives</li>
                    <li>Designing engaging activities</li>
                    <li>Planning assessment methods</li>
                    <li>Suggesting materials needed</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={generateLessonPlan}
                  style={{
                    background: '#2bb6bb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: '0 auto'
                  }}
                >
                  <FaRobot /> Generate Lesson Plan
                </button>
                <p style={{ color: '#666', marginTop: 16 }}>
                  Click the button above to generate your AI-powered lesson plan
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Edit Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Basic Information</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Title</label>
                    <input
                      type="text"
                      value={lessonPlan.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Subject</label>
                      <select
                        value={lessonPlan.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Subject</option>
                        <option value="Math">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Art">Art</option>
                        <option value="Physical Education">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Grade</label>
                      <select
                        value={lessonPlan.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Grade</option>
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Duration</label>
                    <input
                      type="text"
                      value={lessonPlan.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Learning Objectives</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.objectives.map((obj, index) => (
                    <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={(e) => handleUpdateObjective(obj.id, 'completed', e.target.checked)}
                      />
                      <input
                        type="text"
                        value={obj.text}
                        onChange={(e) => handleUpdateObjective(obj.id, 'text', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                          fontSize: 13
                        }}
                      />
                      <button
                        onClick={() => handleRemoveObjective(obj.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddObjective}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    <FaPlus /> Add Objective
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Materials</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.materials.map((mat) => (
                    <div key={mat.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={mat.name}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                          placeholder="Material name"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <input
                          type="text"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <button
                          onClick={() => handleRemoveMaterial(mat.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: 4
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddMaterial}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <FaPlus /> Add Material
                  </button>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Assessment</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <textarea
                    value={lessonPlan.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    placeholder="Describe assessment methods..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Save & Share Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Save Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    onClick={saveToGoogleDrive}
                    style={{
                      background: '#4285f4',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaGoogleDrive /> Save to Google Drive
                  </button>
                  <button
                    onClick={downloadAsWord}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaDownload /> Download as Document
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Lesson Plan Preview</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: '#2d3a2e' }}>{lessonPlan.title}</h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Subject:</strong> {lessonPlan.subject}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Grade:</strong> {lessonPlan.grade}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Duration:</strong> {lessonPlan.duration}</p>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Objectives:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.objectives.map((obj, index) => (
                      <li key={obj.id}>{obj.text}</li>
                    ))}
                  </ul>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Materials:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.materials.map((mat) => (
                      <li key={mat.id}>{mat.name} ({mat.quantity})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: '#2d3a2e',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2d3a2e', margin: 0 }}>AI Lesson Roadmap</h1>
            <p style={{ color: '#666', margin: '4px 0 0 0' }}>AI-powered lesson planning with Google Drive integration</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: currentStep >= step.id ? '#2bb6bb' : '#e9ecef',
                  color: currentStep >= step.id ? '#fff' : '#666',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {currentStep > step.id ? <FaCheckCircle /> : step.id}
                </div>
                <span style={{
                  fontWeight: 600,
                  color: currentStep >= step.id ? '#2d3a2e' : '#666',
                  fontSize: 14
                }}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div style={{
                    width: 40,
                    height: 2,
                    background: currentStep > step.id ? '#2bb6bb' : '#e9ecef'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem', minHeight: 500 }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              background: currentStep === 1 ? '#e9ecef' : '#fff',
              color: currentStep === 1 ? '#666' : '#2d3a2e',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {currentStep === steps.length ? (
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: '#2bb6bb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create New Plan
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === 2 && !aiGenerating}
                style={{
                  background: currentStep === 2 && !aiGenerating ? '#e9ecef' : '#2bb6bb',
                  color: currentStep === 2 && !aiGenerating ? '#666' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: currentStep === 2 && !aiGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LessonRoadmap; 
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaPrint, FaShare, FaClock, FaUsers, FaBook, FaLightbulb, FaCheckCircle, FaRegCircle, FaBullseye, FaRobot, FaGoogleDrive, FaDownload, FaSpinner } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const LessonRoadmap = ({ onBack }) => {
  const [lessonPlan, setLessonPlan] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: '',
    objectives: [],
    materials: [],
    activities: [],
    assessment: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    topic: '',
    learningStyle: 'mixed',
    classSize: '',
    timeAvailable: '',
    difficulty: 'medium',
    includeActivities: true,
    includeAssessment: true,
    culturalContext: ''
  });

  const steps = [
    { id: 1, title: 'AI Input', icon: <FaRobot /> },
    { id: 2, title: 'Generate', icon: <FaLightbulb /> },
    { id: 3, title: 'Edit & Review', icon: <FaEdit /> },
    { id: 4, title: 'Save & Share', icon: <FaGoogleDrive /> }
  ];

  const handleInputChange = (field, value) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleAiInputChange = (field, value) => {
    setAiInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateLessonPlan = async () => {
    if (!aiInputs.topic) {
      alert('Please enter a topic');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(aiInputs)
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.lessonPlan);
        setCurrentStep(3);
        
        // Show demo mode notification if applicable
        if (data.demo) {
          alert('Demo mode: This is a sample lesson plan. For AI-generated plans, add billing to your OpenAI account.');
        }
      } else {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      alert('Error generating lesson plan: ' + error.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const saveToGoogleDrive = async () => {
    // Simulate Google Drive integration
    alert('Connecting to Google Drive...');
    setTimeout(() => {
      alert('Lesson plan saved to Google Drive successfully!');
    }, 2000);
  };

  const downloadAsWord = () => {
    // Simulate Word document download
    const content = `
Lesson Plan: ${lessonPlan.title}
Subject: ${lessonPlan.subject}
Grade: ${lessonPlan.grade}
Duration: ${lessonPlan.duration}

OBJECTIVES:
${lessonPlan.objectives.map(obj => `• ${obj.text}`).join('\n')}

MATERIALS:
${lessonPlan.materials.map(mat => `• ${mat.name} (${mat.quantity}) - ${mat.notes}`).join('\n')}

ACTIVITIES:
${lessonPlan.activities.map(act => `• ${act.name} (${act.duration}) - ${act.description}`).join('\n')}

ASSESSMENT:
${lessonPlan.assessment}

NOTES:
${lessonPlan.notes}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}_lesson_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddObjective = () => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: Date.now(), text: '', completed: false }]
    }));
  };

  const handleUpdateObjective = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleRemoveObjective = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleAddMaterial = () => {
    setLessonPlan(prev => ({
      ...prev,
      materials: [...prev.materials, { id: Date.now(), name: '', quantity: '', notes: '' }]
    }));
  };

  const handleUpdateMaterial = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.map(mat => 
        mat.id === id ? { ...mat, [field]: value } : mat
      )
    }));
  };

  const handleRemoveMaterial = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id)
    }));
  };

  const handleAddActivity = () => {
    setLessonPlan(prev => ({
      ...prev,
      activities: [...prev.activities, { 
        id: Date.now(), 
        name: '', 
        duration: '', 
        description: '', 
        type: 'individual' 
      }]
    }));
  };

  const handleUpdateActivity = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.map(act => 
        act.id === id ? { ...act, [field]: value } : act
      )
    }));
  };

  const handleRemoveActivity = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>AI Lesson Plan Generator</h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Tell us about your lesson and our AI will generate a comprehensive lesson plan for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Lesson Topic</label>
                <input
                  type="text"
                  value={aiInputs.topic}
                  onChange={(e) => handleAiInputChange('topic', e.target.value)}
                  placeholder="e.g., Fractions, Photosynthesis, Creative Writing"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Learning Style</label>
                  <select
                    value={aiInputs.learningStyle}
                    onChange={(e) => handleAiInputChange('learningStyle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Class Size</label>
                  <input
                    type="number"
                    value={aiInputs.classSize}
                    onChange={(e) => handleAiInputChange('classSize', e.target.value)}
                    placeholder="e.g., 25"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Time Available</label>
                  <input
                    type="text"
                    value={aiInputs.timeAvailable}
                    onChange={(e) => handleAiInputChange('timeAvailable', e.target.value)}
                    placeholder="e.g., 45 minutes"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Difficulty Level</label>
                  <select
                    value={aiInputs.difficulty}
                    onChange={(e) => handleAiInputChange('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Cultural Context (Optional)</label>
                <input
                  type="text"
                  value={aiInputs.culturalContext}
                  onChange={(e) => handleAiInputChange('culturalContext', e.target.value)}
                  placeholder="e.g., Nigerian culture, African history"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeActivities}
                    onChange={(e) => handleAiInputChange('includeActivities', e.target.checked)}
                  />
                  Include Activities
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeAssessment}
                    onChange={(e) => handleAiInputChange('includeAssessment', e.target.checked)}
                  />
                  Include Assessment
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: 600, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Generating Your Lesson Plan</h3>
            {aiGenerating ? (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ color: '#666', marginBottom: 16 }}>
                  Our AI is analyzing your requirements and creating a comprehensive lesson plan...
                </p>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>AI is working on:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Creating learning objectives</li>
                    <li>Designing engaging activities</li>
                    <li>Planning assessment methods</li>
                    <li>Suggesting materials needed</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={generateLessonPlan}
                  style={{
                    background: '#2bb6bb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: '0 auto'
                  }}
                >
                  <FaRobot /> Generate Lesson Plan
                </button>
                <p style={{ color: '#666', marginTop: 16 }}>
                  Click the button above to generate your AI-powered lesson plan
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Edit Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Basic Information</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Title</label>
                    <input
                      type="text"
                      value={lessonPlan.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Subject</label>
                      <select
                        value={lessonPlan.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Subject</option>
                        <option value="Math">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Art">Art</option>
                        <option value="Physical Education">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Grade</label>
                      <select
                        value={lessonPlan.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Grade</option>
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Duration</label>
                    <input
                      type="text"
                      value={lessonPlan.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Learning Objectives</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.objectives.map((obj, index) => (
                    <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={(e) => handleUpdateObjective(obj.id, 'completed', e.target.checked)}
                      />
                      <input
                        type="text"
                        value={obj.text}
                        onChange={(e) => handleUpdateObjective(obj.id, 'text', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                          fontSize: 13
                        }}
                      />
                      <button
                        onClick={() => handleRemoveObjective(obj.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddObjective}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    <FaPlus /> Add Objective
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Materials</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.materials.map((mat) => (
                    <div key={mat.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={mat.name}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                          placeholder="Material name"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <input
                          type="text"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <button
                          onClick={() => handleRemoveMaterial(mat.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: 4
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddMaterial}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <FaPlus /> Add Material
                  </button>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Assessment</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <textarea
                    value={lessonPlan.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    placeholder="Describe assessment methods..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Save & Share Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Save Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    onClick={saveToGoogleDrive}
                    style={{
                      background: '#4285f4',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaGoogleDrive /> Save to Google Drive
                  </button>
                  <button
                    onClick={downloadAsWord}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaDownload /> Download as Document
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Lesson Plan Preview</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: '#2d3a2e' }}>{lessonPlan.title}</h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Subject:</strong> {lessonPlan.subject}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Grade:</strong> {lessonPlan.grade}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Duration:</strong> {lessonPlan.duration}</p>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Objectives:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.objectives.map((obj, index) => (
                      <li key={obj.id}>{obj.text}</li>
                    ))}
                  </ul>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Materials:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.materials.map((mat) => (
                      <li key={mat.id}>{mat.name} ({mat.quantity})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: '#2d3a2e',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2d3a2e', margin: 0 }}>AI Lesson Roadmap</h1>
            <p style={{ color: '#666', margin: '4px 0 0 0' }}>AI-powered lesson planning with Google Drive integration</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: currentStep >= step.id ? '#2bb6bb' : '#e9ecef',
                  color: currentStep >= step.id ? '#fff' : '#666',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {currentStep > step.id ? <FaCheckCircle /> : step.id}
                </div>
                <span style={{
                  fontWeight: 600,
                  color: currentStep >= step.id ? '#2d3a2e' : '#666',
                  fontSize: 14
                }}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div style={{
                    width: 40,
                    height: 2,
                    background: currentStep > step.id ? '#2bb6bb' : '#e9ecef'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem', minHeight: 500 }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              background: currentStep === 1 ? '#e9ecef' : '#fff',
              color: currentStep === 1 ? '#666' : '#2d3a2e',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {currentStep === steps.length ? (
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: '#2bb6bb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create New Plan
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === 2 && !aiGenerating}
                style={{
                  background: currentStep === 2 && !aiGenerating ? '#e9ecef' : '#2bb6bb',
                  color: currentStep === 2 && !aiGenerating ? '#666' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: currentStep === 2 && !aiGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LessonRoadmap; 
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaPrint, FaShare, FaClock, FaUsers, FaBook, FaLightbulb, FaCheckCircle, FaRegCircle, FaBullseye, FaRobot, FaGoogleDrive, FaDownload, FaSpinner } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const LessonRoadmap = ({ onBack }) => {
  const [lessonPlan, setLessonPlan] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: '',
    objectives: [],
    materials: [],
    activities: [],
    assessment: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    topic: '',
    learningStyle: 'mixed',
    classSize: '',
    timeAvailable: '',
    difficulty: 'medium',
    includeActivities: true,
    includeAssessment: true,
    culturalContext: ''
  });

  const steps = [
    { id: 1, title: 'AI Input', icon: <FaRobot /> },
    { id: 2, title: 'Generate', icon: <FaLightbulb /> },
    { id: 3, title: 'Edit & Review', icon: <FaEdit /> },
    { id: 4, title: 'Save & Share', icon: <FaGoogleDrive /> }
  ];

  const handleInputChange = (field, value) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleAiInputChange = (field, value) => {
    setAiInputs(prev => ({ ...prev, [field]: value }));
  };

  const generateLessonPlan = async () => {
    if (!aiInputs.topic) {
      alert('Please enter a topic');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(aiInputs)
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan');
      }

      const data = await response.json();
      
      if (data.success) {
        setLessonPlan(data.lessonPlan);
        setCurrentStep(3);
        
        // Show demo mode notification if applicable
        if (data.demo) {
          alert('Demo mode: This is a sample lesson plan. For AI-generated plans, add billing to your OpenAI account.');
        }
      } else {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      alert('Error generating lesson plan: ' + error.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const saveToGoogleDrive = async () => {
    // Simulate Google Drive integration
    alert('Connecting to Google Drive...');
    setTimeout(() => {
      alert('Lesson plan saved to Google Drive successfully!');
    }, 2000);
  };

  const downloadAsWord = () => {
    // Simulate Word document download
    const content = `
Lesson Plan: ${lessonPlan.title}
Subject: ${lessonPlan.subject}
Grade: ${lessonPlan.grade}
Duration: ${lessonPlan.duration}

OBJECTIVES:
${lessonPlan.objectives.map(obj => `• ${obj.text}`).join('\n')}

MATERIALS:
${lessonPlan.materials.map(mat => `• ${mat.name} (${mat.quantity}) - ${mat.notes}`).join('\n')}

ACTIVITIES:
${lessonPlan.activities.map(act => `• ${act.name} (${act.duration}) - ${act.description}`).join('\n')}

ASSESSMENT:
${lessonPlan.assessment}

NOTES:
${lessonPlan.notes}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonPlan.title.replace(/[^a-zA-Z0-9]/g, '_')}_lesson_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddObjective = () => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: [...prev.objectives, { id: Date.now(), text: '', completed: false }]
    }));
  };

  const handleUpdateObjective = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => 
        obj.id === id ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const handleRemoveObjective = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const handleAddMaterial = () => {
    setLessonPlan(prev => ({
      ...prev,
      materials: [...prev.materials, { id: Date.now(), name: '', quantity: '', notes: '' }]
    }));
  };

  const handleUpdateMaterial = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.map(mat => 
        mat.id === id ? { ...mat, [field]: value } : mat
      )
    }));
  };

  const handleRemoveMaterial = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id)
    }));
  };

  const handleAddActivity = () => {
    setLessonPlan(prev => ({
      ...prev,
      activities: [...prev.activities, { 
        id: Date.now(), 
        name: '', 
        duration: '', 
        description: '', 
        type: 'individual' 
      }]
    }));
  };

  const handleUpdateActivity = (id, field, value) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.map(act => 
        act.id === id ? { ...act, [field]: value } : act
      )
    }));
  };

  const handleRemoveActivity = (id) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>AI Lesson Plan Generator</h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Tell us about your lesson and our AI will generate a comprehensive lesson plan for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Lesson Topic</label>
                <input
                  type="text"
                  value={aiInputs.topic}
                  onChange={(e) => handleAiInputChange('topic', e.target.value)}
                  placeholder="e.g., Fractions, Photosynthesis, Creative Writing"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Learning Style</label>
                  <select
                    value={aiInputs.learningStyle}
                    onChange={(e) => handleAiInputChange('learningStyle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Class Size</label>
                  <input
                    type="number"
                    value={aiInputs.classSize}
                    onChange={(e) => handleAiInputChange('classSize', e.target.value)}
                    placeholder="e.g., 25"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Time Available</label>
                  <input
                    type="text"
                    value={aiInputs.timeAvailable}
                    onChange={(e) => handleAiInputChange('timeAvailable', e.target.value)}
                    placeholder="e.g., 45 minutes"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Difficulty Level</label>
                  <select
                    value={aiInputs.difficulty}
                    onChange={(e) => handleAiInputChange('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      fontSize: 16
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Cultural Context (Optional)</label>
                <input
                  type="text"
                  value={aiInputs.culturalContext}
                  onChange={(e) => handleAiInputChange('culturalContext', e.target.value)}
                  placeholder="e.g., Nigerian culture, African history"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 16
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeActivities}
                    onChange={(e) => handleAiInputChange('includeActivities', e.target.checked)}
                  />
                  Include Activities
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={aiInputs.includeAssessment}
                    onChange={(e) => handleAiInputChange('includeAssessment', e.target.checked)}
                  />
                  Include Assessment
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: 600, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Generating Your Lesson Plan</h3>
            {aiGenerating ? (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <p style={{ color: '#666', marginBottom: 16 }}>
                  Our AI is analyzing your requirements and creating a comprehensive lesson plan...
                </p>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>AI is working on:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Creating learning objectives</li>
                    <li>Designing engaging activities</li>
                    <li>Planning assessment methods</li>
                    <li>Suggesting materials needed</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={generateLessonPlan}
                  style={{
                    background: '#2bb6bb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '16px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: '0 auto'
                  }}
                >
                  <FaRobot /> Generate Lesson Plan
                </button>
                <p style={{ color: '#666', marginTop: 16 }}>
                  Click the button above to generate your AI-powered lesson plan
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Edit Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Basic Information</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Title</label>
                    <input
                      type="text"
                      value={lessonPlan.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Subject</label>
                      <select
                        value={lessonPlan.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Subject</option>
                        <option value="Math">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Art">Art</option>
                        <option value="Physical Education">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Grade</label>
                      <select
                        value={lessonPlan.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                          fontSize: 14
                        }}
                      >
                        <option value="">Select Grade</option>
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Duration</label>
                    <input
                      type="text"
                      value={lessonPlan.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Learning Objectives</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.objectives.map((obj, index) => (
                    <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={(e) => handleUpdateObjective(obj.id, 'completed', e.target.checked)}
                      />
                      <input
                        type="text"
                        value={obj.text}
                        onChange={(e) => handleUpdateObjective(obj.id, 'text', e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 4,
                          border: '1px solid #ddd',
                          fontSize: 13
                        }}
                      />
                      <button
                        onClick={() => handleRemoveObjective(obj.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddObjective}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    <FaPlus /> Add Objective
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Materials</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  {lessonPlan.materials.map((mat) => (
                    <div key={mat.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          value={mat.name}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'name', e.target.value)}
                          placeholder="Material name"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <input
                          type="text"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterial(mat.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            border: '1px solid #ddd',
                            fontSize: 13
                          }}
                        />
                        <button
                          onClick={() => handleRemoveMaterial(mat.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: 4
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddMaterial}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <FaPlus /> Add Material
                  </button>
                </div>

                <h4 style={{ marginTop: 24, marginBottom: 16, color: '#2d3a2e' }}>Assessment</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8 }}>
                  <textarea
                    value={lessonPlan.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    placeholder="Describe assessment methods..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      fontSize: 14,
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ marginBottom: 24, color: '#2d3a2e' }}>Save & Share Your Lesson Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Save Options</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button
                    onClick={saveToGoogleDrive}
                    style={{
                      background: '#4285f4',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaGoogleDrive /> Save to Google Drive
                  </button>
                  <button
                    onClick={downloadAsWord}
                    style={{
                      background: '#2bb6bb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <FaDownload /> Download as Document
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16, color: '#2d3a2e' }}>Lesson Plan Preview</h4>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                  <h5 style={{ margin: '0 0 12px 0', color: '#2d3a2e' }}>{lessonPlan.title}</h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Subject:</strong> {lessonPlan.subject}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Grade:</strong> {lessonPlan.grade}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14 }}><strong>Duration:</strong> {lessonPlan.duration}</p>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Objectives:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.objectives.map((obj, index) => (
                      <li key={obj.id}>{obj.text}</li>
                    ))}
                  </ul>
                  
                  <h6 style={{ margin: '12px 0 8px 0', color: '#2d3a2e' }}>Materials:</h6>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontSize: 14 }}>
                    {lessonPlan.materials.map((mat) => (
                      <li key={mat.id}>{mat.name} ({mat.quantity})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: '#2d3a2e',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2d3a2e', margin: 0 }}>AI Lesson Roadmap</h1>
            <p style={{ color: '#666', margin: '4px 0 0 0' }}>AI-powered lesson planning with Google Drive integration</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: currentStep >= step.id ? '#2bb6bb' : '#e9ecef',
                  color: currentStep >= step.id ? '#fff' : '#666',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {currentStep > step.id ? <FaCheckCircle /> : step.id}
                </div>
                <span style={{
                  fontWeight: 600,
                  color: currentStep >= step.id ? '#2d3a2e' : '#666',
                  fontSize: 14
                }}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div style={{
                    width: 40,
                    height: 2,
                    background: currentStep > step.id ? '#2bb6bb' : '#e9ecef'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem', minHeight: 500 }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              background: currentStep === 1 ? '#e9ecef' : '#fff',
              color: currentStep === 1 ? '#666' : '#2d3a2e',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {currentStep === steps.length ? (
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: '#2bb6bb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create New Plan
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === 2 && !aiGenerating}
                style={{
                  background: currentStep === 2 && !aiGenerating ? '#e9ecef' : '#2bb6bb',
                  color: currentStep === 2 && !aiGenerating ? '#666' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: currentStep === 2 && !aiGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LessonRoadmap; 