import { filterTeams, getTeamColor } from '@/lib/matchDataUtils';
import { MatchData } from '@/models/aggregations/matchData';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Link as MuiLink,
	Box,
} from '@mui/material';
import Link from 'next/link';

interface Column {
	label: string;
	minWidth?: number;
	align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ label: 'Team #' },
	{ label: 'Upper Teleop' },
	{ label: 'Low Teleop' },
	{ label: 'Upper Auto' },
	{ label: 'Low Auto' },
];

interface Props {
	match: MatchData;
}

const BodyCell: React.FC = ({ children, ...props }) => (
	<TableCell sx={{ color: 'white', fontWeight: 600 }} align='center' {...props}>
		{children}
	</TableCell>
);

const MobileShootingTable: React.VFC<Props> = ({ match }) => {
	return (
		<Box sx={{ maxWidth: '1000px' }}>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((col) => (
							<TableCell
								key={col.label}
								align='center'
								style={{ minWidth: col.minWidth }}
							>
								{col.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{filterTeams(match, (team) => Boolean(team)).map((team) => {
						if (!team) return <></>;
						return (
							<TableRow
								key={team?._id}
								sx={{
									backgroundColor: getTeamColor(match, team),
									color: 'white',
									fontWeight: 500,
								}}
							>
								<BodyCell>
									<Link href={`/teams/${team?.teamNumber}`} passHref>
										<MuiLink
											sx={{ color: 'white', textDecoration: 'underline' }}
										>
											{team?.teamNumber}
										</MuiLink>
									</Link>
								</BodyCell>
								<BodyCell>{team?.teleopUpperBallsScored}</BodyCell>
								<BodyCell>{team?.teleopLowBallsScored}</BodyCell>
								<BodyCell>{team?.autoUpperBallsScored}</BodyCell>
								<BodyCell>{team?.autoLowBallsScored}</BodyCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Box>
	);
};

export default MobileShootingTable;
