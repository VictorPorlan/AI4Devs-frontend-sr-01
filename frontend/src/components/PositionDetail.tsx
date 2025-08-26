import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import './PositionDetail.css';
import { positionService } from '../services/positionService';

interface InterviewStep {
  id: number;
  name: string;
  orderIndex: number;
}

interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

interface PositionData {
  positionName: string;
  interviewFlow: InterviewFlow;
}

interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedCandidate, setDraggedCandidate] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPositionData();
      fetchCandidates();
    }
  }, [id]);

  const fetchPositionData = async () => {
    try {
      if (!id) return;
      
      // Fallback mock data
      const mockData: PositionData = {
        positionName: "Senior Backend Engineer",
        interviewFlow: {
          id: 1,
          description: "Standard development interview process",
          interviewSteps: [
            { id: 1, name: "Initial Screening", orderIndex: 1 },
            { id: 2, name: "Technical Interview", orderIndex: 2 },
            { id: 3, name: "Manager Interview", orderIndex: 3 }
          ]
        }
      };
      
      try {
        const data = await positionService.getInterviewFlow(id);
        setPositionData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching position data:', error);
        setError('Error al cargar los datos de la posición');
        setPositionData(mockData);
      }
    } catch (error) {
      console.error('Error in fetchPositionData:', error);
      setError('Error al cargar los datos de la posición');
    }
  };

  const fetchCandidates = async () => {
    try {
      if (!id) return;
      
      // Fallback mock data
      const mockCandidates: Candidate[] = [
        { fullName: "Jane Smith", currentInterviewStep: "Technical Interview", averageScore: 4 },
        { fullName: "Carlos García", currentInterviewStep: "Initial Screening", averageScore: 0 },
        { fullName: "John Doe", currentInterviewStep: "Manager Interview", averageScore: 5 }
      ];
      
      try {
        const data = await positionService.getCandidates(id);
        setCandidates(data);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Error al cargar los candidatos');
        setCandidates(mockCandidates);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchCandidates:', error);
      setError('Error al cargar los candidatos');
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, candidateName: string) => {
    setDraggedCandidate(candidateName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stepName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(stepName);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStep: string) => {
    e.preventDefault();
    
    if (!draggedCandidate) return;
    
    setDragOverColumn(null);

    // Find the candidate and update their stage
    const candidate = candidates.find(c => c.fullName === draggedCandidate);
    if (!candidate) return;

    // Find the interview step ID for the target step
    const targetStepData = positionData?.interviewFlow.interviewSteps.find(s => s.name === targetStep);
    if (!targetStepData) return;

    // Store the original step for potential rollback
    const originalStep = candidate.currentInterviewStep;

    try {

      // Update local state optimistically
      setCandidates(prev => 
        prev.map(c => 
          c.fullName === draggedCandidate 
            ? { ...c, currentInterviewStep: targetStep }
            : c
        )
      );

      try {
        // Call the actual API
        await positionService.updateCandidateStage(candidate.fullName, targetStepData.id.toString());
      } catch (error) {
        console.error('Error updating candidate stage:', error);
        // Revert local state if API call fails
        setCandidates(prev => 
          prev.map(c => 
            c.fullName === draggedCandidate 
              ? { ...c, currentInterviewStep: originalStep }
              : c
          )
        );
        return;
      }
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } finally {
      setDraggedCandidate(null);
    }
  };

  const getCandidatesForStep = (stepName: string) => {
    return candidates.filter(c => c.currentInterviewStep === stepName);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'success';
    if (score >= 2) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Cargando posición...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!positionData) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Posición no encontrada</h4>
            <p>La posición solicitada no existe o no se pudo cargar.</p>
            <Button variant="outline-warning" onClick={() => navigate('/positions')}>
              Volver a posiciones
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      {/* Success Message */}
      {showSuccessMessage && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>¡Éxito!</strong> El candidato se ha movido correctamente.
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowSuccessMessage(false)}
              ></button>
            </div>
          </Col>
        </Row>
      )}

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-secondary" 
              className="me-3"
              onClick={() => navigate('/positions')}
            >
              <ArrowLeft /> Volver
            </Button>
            <h2 className="mb-0">{positionData.positionName}</h2>
          </div>
        </Col>
      </Row>

      {/* Kanban Board */}
      <Row className="kanban-board">
        {positionData.interviewFlow.interviewSteps
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((step) => (
            <Col key={step.id} className="mb-3">
              <Card className="h-100">
                <Card.Header className="text-center fw-bold d-flex justify-content-between align-items-center">
                  <span>{step.name}</span>
                  <Badge bg="secondary" className="ms-2">
                    {getCandidatesForStep(step.name).length}
                  </Badge>
                </Card.Header>
                <Card.Body 
                  className={`kanban-column ${dragOverColumn === step.name ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, step.name)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, step.name)}
                >
                  {getCandidatesForStep(step.name).map((candidate, index) => (
                    <Card 
                      key={`${candidate.fullName}-${index}`}
                      className={`mb-2 candidate-card ${draggedCandidate === candidate.fullName ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.fullName)}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 fw-bold">{candidate.fullName}</h6>
                          <Badge 
                            bg={getScoreColor(candidate.averageScore)}
                            className="ms-2"
                          >
                            {candidate.averageScore > 0 ? candidate.averageScore : 'N/A'}
                          </Badge>
                        </div>
                        <small className="text-muted">
                          Puntuación media: {candidate.averageScore > 0 ? candidate.averageScore : 'Sin evaluar'}
                        </small>
                      </Card.Body>
                    </Card>
                  ))}
                  
                  {getCandidatesForStep(step.name).length === 0 && (
                    <div className="text-center text-muted py-4">
                      <small>No hay candidatos en esta fase</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default PositionDetail;
