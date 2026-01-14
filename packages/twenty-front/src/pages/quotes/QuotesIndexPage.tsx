import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';
import { PageBody } from '@/ui/layout/page/components/PageBody';
import { useLingui } from '@lingui/react/macro';
import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { IconFileText, IconPlus, IconDownload, IconTrash, IconRefresh } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { StyledTextInput } from '@/ui/field/input/components/TextInput';

const QUOTES_SERVICE_URL = import.meta.env.VITE_QUOTES_SERVICE_URL || 'http://localhost:5173';

interface Quote {
  id: number;
  numero: string;
  year: number;
  cliente: string;
  ruc: string;
  proyecto: string;
  total: number;
  filepath: string;
  filename?: string;
  created_at: string | number;
}

const StyledPageContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(4)};
  overflow: auto;
`;

const StyledToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledSearchContainer = styled.div`
  min-width: 250px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.background.primary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.light};
`;

const StyledThead = styled.thead`
  background: ${({ theme }) => theme.background.tertiary};
`;

const StyledTh = styled.th`
  padding: ${({ theme }) => theme.spacing(3)};
  text-align: left;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
`;

const StyledTr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.background.transparent.lighter};
  }
`;

const StyledTd = styled.td`
  padding: ${({ theme }) => theme.spacing(3)};
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.font.color.primary};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
`;

const StyledNumero = styled.span`
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.blue};
`;

const StyledTotal = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)};
  color: ${({ theme }) => theme.font.color.tertiary};
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)};
  color: ${({ theme }) => theme.font.color.secondary};
`;

export const QuotesIndexPage = () => {
  const { t } = useLingui();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/integrations/quotes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const openNewQuote = () => {
    window.open(QUOTES_SERVICE_URL, '_blank');
  };

  const handleDownload = async (quote: Quote) => {
    try {
      const response = await fetch(`/api/integrations/quotes/${quote.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `COT-${quote.year}-${quote.numero}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading quote:', error);
    }
  };

  const handleDelete = async (quote: Quote) => {
    if (!confirm(t`¿Está seguro de eliminar la cotización COT-${quote.year}-${quote.numero}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/integrations/quotes/${quote.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        loadQuotes();
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const formatDate = (value: string | number) => {
    if (!value) return '-';
    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  return (
    <PageContainer>
      <PageHeader title={t`Cotizaciones`} Icon={IconFileText}>
        <Button
          Icon={IconPlus}
          title={t`Nueva Cotización`}
          onClick={openNewQuote}
          variant="primary"
        />
      </PageHeader>
      <PageBody>
        <StyledPageContent>
          <StyledToolbar>
            <StyledSearchContainer>
              <StyledTextInput
                instanceId="quotes-search"
                placeholder={t`Buscar por cliente, proyecto o número...`}
                value={search}
                onChange={setSearch}
              />
            </StyledSearchContainer>
            <StyledButtonGroup>
              <Button
                Icon={IconRefresh}
                title={t`Actualizar`}
                onClick={loadQuotes}
                variant="secondary"
              />
            </StyledButtonGroup>
          </StyledToolbar>

          {loading ? (
            <StyledLoading>{t`Cargando cotizaciones...`}</StyledLoading>
          ) : quotes.length === 0 ? (
            <StyledEmptyState>
              <IconFileText size={48} />
              <span>{t`No hay cotizaciones registradas`}</span>
              <Button
                Icon={IconPlus}
                title={t`Crear Primera Cotización`}
                onClick={openNewQuote}
                variant="primary"
              />
            </StyledEmptyState>
          ) : (
            <StyledTable>
              <StyledThead>
                <tr>
                  <StyledTh>{t`Número`}</StyledTh>
                  <StyledTh>{t`Cliente`}</StyledTh>
                  <StyledTh>{t`Proyecto`}</StyledTh>
                  <StyledTh>{t`Total`}</StyledTh>
                  <StyledTh>{t`Fecha`}</StyledTh>
                  <StyledTh>{t`Acciones`}</StyledTh>
                </tr>
              </StyledThead>
              <tbody>
                {quotes.map((quote) => (
                  <StyledTr key={quote.id}>
                    <StyledTd>
                      <StyledNumero>COT-{quote.year}-{quote.numero}</StyledNumero>
                    </StyledTd>
                    <StyledTd>
                      {quote.cliente || '-'}
                      {quote.ruc && <div style={{ fontSize: '0.85em', opacity: 0.7 }}>RUC: {quote.ruc}</div>}
                    </StyledTd>
                    <StyledTd>{quote.proyecto || '-'}</StyledTd>
                    <StyledTd>
                      <StyledTotal>{formatCurrency(quote.total)}</StyledTotal>
                    </StyledTd>
                    <StyledTd>{formatDate(quote.created_at)}</StyledTd>
                    <StyledTd>
                      <StyledActions>
                        <Button
                          Icon={IconDownload}
                          title={t`Descargar`}
                          onClick={() => handleDownload(quote)}
                          variant="tertiary"
                          size="small"
                        />
                        <Button
                          Icon={IconTrash}
                          title={t`Eliminar`}
                          onClick={() => handleDelete(quote)}
                          variant="tertiary"
                          size="small"
                        />
                      </StyledActions>
                    </StyledTd>
                  </StyledTr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </StyledPageContent>
      </PageBody>
    </PageContainer>
  );
};
