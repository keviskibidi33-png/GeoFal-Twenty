import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';
import { PageBody } from '@/ui/layout/page/components/PageBody';
import { useLingui } from '@lingui/react/macro';
import styled from '@emotion/styled';
import { IconFileText, IconPlus, IconExternalLink } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';

const QUOTES_SERVICE_URL = import.meta.env.VITE_QUOTES_SERVICE_URL || 'http://localhost:5173';

const StyledPageContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

const StyledIframeContainer = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  overflow: hidden;
  min-height: 500px;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const QuotesIndexPage = () => {
  const { t } = useLingui();

  const openNewQuote = () => {
    window.open(QUOTES_SERVICE_URL, '_blank');
  };

  const openQuotesList = () => {
    window.open(`${QUOTES_SERVICE_URL}/quotes`, '_blank');
  };

  return (
    <PageContainer>
      <PageHeader title={t`Cotizaciones`} Icon={IconFileText} />
      <PageBody>
        <StyledPageContent>
          <StyledButtonsContainer>
            <Button
              Icon={IconPlus}
              title={t`Nueva Cotización`}
              onClick={openNewQuote}
              variant="primary"
            />
            <Button
              Icon={IconExternalLink}
              title={t`Abrir en Nueva Ventana`}
              onClick={openQuotesList}
              variant="secondary"
            />
          </StyledButtonsContainer>
          <StyledIframeContainer>
            <StyledIframe
              src={`${QUOTES_SERVICE_URL}/quotes`}
              title={t`Lista de Cotizaciones`}
            />
          </StyledIframeContainer>
        </StyledPageContent>
      </PageBody>
    </PageContainer>
  );
};
