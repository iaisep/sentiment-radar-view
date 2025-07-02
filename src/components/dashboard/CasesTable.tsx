
import { useState } from 'react';
import { Interaction } from '@/types/dashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface CasesTableProps {
  interactions: Interaction[];
  onCaseClick?: (interaction: Interaction) => void;
  selectedCase?: string | null;
}

const getSentimentBadge = (sentiment: string) => {
  const variants = {
    positive: 'bg-green-100 text-green-800 border-green-200',
    neutral: 'bg-blue-100 text-blue-800 border-blue-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    negative: 'bg-red-100 text-red-800 border-red-200'
  };
  return variants[sentiment as keyof typeof variants] || 'bg-gray-100 text-gray-800';
};

const getPriorityBadge = (priority: string) => {
  const variants = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  return variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-600';
};

const getStatusBadge = (status: string) => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    escalated: 'bg-red-100 text-red-800'
  };
  return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-600';
};

export function CasesTable({ interactions, onCaseClick, selectedCase }: CasesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Ordenar por timestamp más reciente
  const sortedInteractions = [...interactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const totalPages = Math.ceil(sortedInteractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInteractions = sortedInteractions.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-gradient-card rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Casos Activos ({interactions.length})
        </h3>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Sentimiento</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>IA/Humano</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Última Actividad</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInteractions.map((interaction) => (
              <TableRow 
                key={interaction.id}
                className={selectedCase === interaction.id ? 'bg-muted' : 'hover:bg-muted/50'}
              >
                <TableCell className="font-medium">
                  {interaction.ticketId}
                </TableCell>
                <TableCell>
                  <Badge className={getSentimentBadge(interaction.sentiment)}>
                    {interaction.sentiment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityBadge(interaction.priority)}>
                    {interaction.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(interaction.status)}>
                    {interaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {interaction.channel}
                </TableCell>
                <TableCell>
                  <span className={interaction.aiHandled ? 'text-green-600' : 'text-orange-600'}>
                    {interaction.aiHandled ? 'IA' : 'Humano'}
                  </span>
                </TableCell>
                <TableCell>
                  {interaction.duration} min
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(interaction.lastActivity)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onCaseClick?.(interaction)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
