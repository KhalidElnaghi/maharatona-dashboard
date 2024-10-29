'use client';

import Container from '@mui/material/Container';
import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import FormProvider from 'src/components/hook-form';
import { useCallback, useEffect,  useState } from 'react';
import { ICenter } from 'src/types/centers';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SharedTable from 'src/CustomSharedComponents/SharedTable/SharedTable';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { deleteField } from 'src/actions/categories';
import { NewEditCategoryDialog } from './new-edit-category-dialog';

type props = {
  categories: any[];
  count: number;
};

const CategoriesView = ({ count, categories }: Readonly<props>) => {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const router = useRouter();
  const confirmActivate = useBoolean();
  const confirmDeactivate = useBoolean();
  const [selectedId, setSelectedId] = useState<string | null>();
  const [selectedCategory, setSelectedCategory] = useState<ICenter | undefined>();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  useEffect(() => {
    router.push(`${pathname}`);
  }, []);

  const TABLE_HEAD = [
    { id: 'avatar', label: 'LABEL.IMAGE' },
    { id: 'name_ar', label: 'LABEL.NAME_AR' },
    { id: 'name_en', label: 'LABEL.NAME_EN' },
    { id: 'color', label: 'LABEL.COLOR' },
    { id: '', label: 'LABEL.SETTINGS' },
  ];

  const formDefaultValues = {
    name: '',
  };
  const pathname = usePathname();
  const methods = useForm({
    defaultValues: formDefaultValues,
  });
  const { setValue } = methods;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
        localStorage.setItem(name, value);
      } else {
        params.delete(name);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, setValue]
  );

  const handleConfirmActivate = async () => {
    const res = await deleteField(selectedCategory);
    if (res.statusCode === 200) {
      enqueueSnackbar(t('MESSAGE.ACTIVATED_SUCCESSFULLY'));
      confirmActivate.onFalse();
    } else {
      enqueueSnackbar(`${res.error}`, { variant: 'error' });
    }
  };
  const handleConfirmDeactivate = async () => {
    const res = await deleteField(selectedCategory);
    if (res.statusCode === 200) {
      enqueueSnackbar(t('MESSAGE.DEACTIVATED_SUCCESSFULLY'));
      confirmDeactivate.onFalse();
    } else {
      enqueueSnackbar(`${res.error}`, { variant: 'error' });
    }
  };

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'xl'}
        sx={{ margin: '0px !important', padding: '0px !important' }}
      >
        <Box
          sx={{
            backgroundImage: `url(/assets/images/centers/header.jpeg)`,
            height: { sm: '300px', xs: '400px' },
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 0,
            boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            paddingBlock: 6,
            alignItems: 'center',
            flexDirection: 'column',
            gap: 4,
            width: '100%',
          }}
        >
          <Typography variant="h3" color="white">
            {t('LABEL.FIELDS_AND_SPECIALTIES')}
          </Typography>
          <Grid
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: 6,
              gap: 3,
            }}
          >
            <Card sx={{ p: 1, ml: 3, mb: 1, width: '50%' }}>
              <FormProvider methods={methods}>
                <TextField
                  sx={{ width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="mingcute:search-line" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={t('LABEL.FIELD_NAME')}
                  type="search"
                  onChange={(e) => createQueryString('search', e.target.value)}
                />
              </FormProvider>
            </Card>

            <Button
              variant="contained"
              onClick={() => setIsFormDialogOpen(true)}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 8,
                py: 1,
                borderRadius: '40px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'primary.dark',
                },
              }}
            >
              {t('BUTTON.ADD_FIELD')}
            </Button>
          </Grid>
        </Box>
        <SharedTable
          count={count}
          data={categories}
          tableHead={TABLE_HEAD}
          actions={[
            {
              sx: { color: 'info.dark' },
              label: t('LABEL.EDIT'),
              onClick: (item) => {
                setSelectedCategory(item);
                setIsFormDialogOpen(true);
              },
            },
            {
              sx: { color: 'info.dark' },

              label: t('LABEL.ACTIVATE'),
              icon: 'uim:process',
              onClick: (item: any) => {
                setSelectedCategory(item);
                confirmActivate.onTrue();
              },
              hide: (row) => row.is_active === true,
            },
            {
              sx: { color: 'error.dark' },
              label: t('LABEL.DEACTIVATE'),
              icon: 'streamline:synchronize-disable-solid',
              onClick: (item: any) => {
                setSelectedCategory(item);
                confirmDeactivate.onTrue();
              },
              hide: (row) => row.is_active === false,
            },
          ]}
          customRender={{
            color: (item: any) => (
              <Typography sx={{ direction: 'rtl', fontSize: '14px' }}>
                {item?.color?.charAt(0) === '#' ? item?.color : `#${item?.color}`}
              </Typography>
            ),
            avatar: (item: any) => <Avatar alt={item?.name} src={item?.avatar} />,
          }}
        />
      </Container>
      <ConfirmDialog
        open={confirmActivate.value}
        onClose={confirmActivate.onFalse}
        title={t('TITLE.ACTIVATE_FIELD')}
        content={t('MESSAGE.CONFIRM_ACTIVATE_FIELD')}
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              handleConfirmActivate();
            }}
          >
            {t('BUTTON.ACTIVATE')}
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmDeactivate.value}
        onClose={confirmDeactivate.onFalse}
        title={t('TITLE.DEACTIVATE_FIELD')}
        content={t('MESSAGE.CONFIRM_DEACTIVATE_FIELD')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleConfirmDeactivate();
            }}
          >
            {t('BUTTON.DEACTIVATE')}
          </Button>
        }
      />

      {isFormDialogOpen ? (
        <NewEditCategoryDialog
          open={isFormDialogOpen}
          onClose={() => {
            setIsFormDialogOpen(false);
            setSelectedCategory(undefined);
          }}
          category={selectedCategory}
        />
      ) : null}
    </>
  );
};

export default CategoriesView;
