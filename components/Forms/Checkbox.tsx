import { Box, Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import { Control, Controller, ControllerProps } from 'react-hook-form';

interface Props {
	control: Control<any>;
	name: string;
	onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	rules?: ControllerProps['rules'];
	label?: string;
	defaultValue?: boolean;
	size?: 'medium' | 'small';
	disabled?: boolean;
}

const Checkbox: React.VFC<Props> = ({
	name,
	control,
	rules,
	label,
	onChange = (e) => {},
	defaultValue,
	size,
	disabled,
}) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
			<Controller
				name={name}
				defaultValue={defaultValue}
				control={control}
				rules={rules}
				render={({ field }) => (
					<FormControlLabel
						disabled={disabled}
						label={label || name}
						control={
							<MuiCheckbox
								name={field.name}
								onChange={(e) => {
									field.onChange(e);
									onChange(e); // from props
								}}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 64 } }}
								onBlur={field.onBlur}
								value={field.value}
								defaultChecked={defaultValue}
								size={size}
							/>
						}
					/>
				)}
			/>
		</Box>
	);
};

export default Checkbox;
