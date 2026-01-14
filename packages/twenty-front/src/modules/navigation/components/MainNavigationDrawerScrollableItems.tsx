import { CurrentWorkspaceMemberFavoritesFolders } from '@/favorites/components/CurrentWorkspaceMemberFavoritesFolders';
import { WorkspaceFavorites } from '@/favorites/components/WorkspaceFavorites';
import { NavigationDrawerOpenedSection } from '@/object-metadata/components/NavigationDrawerOpenedSection';
import { RemoteNavigationDrawerSection } from '@/object-metadata/components/RemoteNavigationDrawerSection';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { IconTable } from 'twenty-ui/display';

const StyledScrollableItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const MainNavigationDrawerScrollableItems = () => {
  const { t } = useLingui();

  return (
    <StyledScrollableItemsContainer>
      <NavigationDrawerItem label={t`Cotizaciones`} to="/quotes" Icon={IconTable} />
      <NavigationDrawerOpenedSection />
      <CurrentWorkspaceMemberFavoritesFolders />
      <WorkspaceFavorites />
      <RemoteNavigationDrawerSection />
    </StyledScrollableItemsContainer>
  );
};
