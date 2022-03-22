import fetcher from '@/lib/fetch';
import { numToDateTimeInput } from '@/lib/formatDate';
import { useUser } from '@/lib/useUser';
import { CreateScheduleBlock, ScheduleBlockI } from '@/models/ScheduleBlock';
import { UserI } from '@/models/User';
import { Delete } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Autocomplete from '../Autocomplete';
import FormSection from '../FormSection';
import { Form } from '../FormStyle';
import { onSubmit } from './onSubmit';

interface Props {
	create: boolean;
	defaultBlock: ScheduleBlockI;
	canEdit?: boolean;
	id?: string;
}

const BlockForm: React.VFC<Props> = ({ create, defaultBlock, canEdit, id }) => {
	const router = useRouter();
	const { data: users } = useSWR<UserI[]>('/api/auth/users?normal=true', fetcher);
	const { user } = useUser({ canRedirect: true, redirectIfNotAdmin: true });
	const { control, handleSubmit } = useForm<ScheduleBlockI>({
		defaultValues: {
			...defaultBlock,
			startTime: numToDateTimeInput(defaultBlock.startTime) as any,
			endTime: numToDateTimeInput(defaultBlock.endTime) as any,
		},
	});

	if (!user || !users) return <CircularProgress />;
	const options = users.map((user) => ({
		username: user.username,
		label: `${user.firstName} ${user.lastName} (${user.username})`,
	}));
	console.log(options);

	if (!user.administrator) {
		return <h1>You are not authorized to use this!</h1>;
	}

	if (user.banned) {
		return <h1>You&#39;ve been banned you sussy baka.</h1>;
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit(create, user))}>
			{user && user.administrator && !create && id && (
				<Button
					variant='contained'
					sx={{ zIndex: 1, position: 'fixed', top: '8rem', right: '2rem' }}
					color='error'
					onClick={() => {
						fetch(`/api/schedule/${id}`, { method: 'DELETE' }).then((res) => {
							if (res.ok) router.push('/casino/matches');
						});
					}}
				>
					<Delete />
				</Button>
			)}
			<FormSection title='Info'>
				<Autocomplete
					options={options}
					control={control}
					isOptionEqualToValue={(opt, v) => opt.username === v.username}
					getOptionLabel={(opt) =>
						opt.firstName
							? `${opt.firstName} ${opt.lastName} (${opt.username})`
							: opt.label
					}
					name='blue1'
					label='Blue 1'
					disabled={!canEdit}
					rules={{ required: true, min: 1 }}
				/>
			</FormSection>
		</Form>
	);
};

export default BlockForm;