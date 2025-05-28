'use client';

import React, { useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { ElementDefinition } from 'cytoscape';

const states = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'];
const minLength = 6;
const maxLength = 50;

const generateElements = (validStates: string[]): ElementDefinition[] => {
	const nodes: ElementDefinition[] = states.map((id, index) => ({
		data: { id, label: id },
		position: { x: index * 120 + 50, y: 100 },
		classes: validStates.includes(id) ? (id === 'q4' ? 'safe' : id === 'q5' ? 'very-safe' : 'valid') : '',
	}));

	const transitions: ElementDefinition[] = [
		{ data: { source: 'q0', target: 'q1', label: 'length ✓', id: 'e0-1' } },
		{ data: { source: 'q1', target: 'q2', label: 'lowercase ✓', id: 'e1-2' } },
		{ data: { source: 'q2', target: 'q3', label: 'number ✓', id: 'e2-3' } },
		{ data: { source: 'q3', target: 'q4', label: 'uppercase ✓', id: 'e3-4' } },
		{ data: { source: 'q4', target: 'q5', label: 'symbol ✓', id: 'e4-5' } },
	].map((edge) => ({
		data: edge.data,
		classes: validStates.includes(edge.data.source) && validStates.includes(edge.data.target) ? 'active' : '',
	}));

	return [...nodes, ...transitions];
};

const checkUpper = (pwd: string) => /[A-Z]/.test(pwd);
const checkLower = (pwd: string) => /[a-z]/.test(pwd);
const checkNumber = (pwd: string) => /\d/.test(pwd);
const checkSymbol = (pwd: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(pwd);

const checkPasswordState = (pwd: string): string[] => {
	const validStates = ['q0'];
	const q1Condition = pwd.length >= minLength && pwd.length <= maxLength;
	const q2Condition = checkLower(pwd);
	const q3Condition = checkNumber(pwd);
	const q4Condition = checkUpper(pwd);
	const q5Condition = checkSymbol(pwd);

	if (q1Condition) validStates.push('q1');
	if (q1Condition && q2Condition) validStates.push('q2');
	if (q1Condition && q2Condition && q3Condition) validStates.push('q3');
	if (q1Condition && q2Condition && q3Condition && q4Condition) validStates.push('q4');
	if (q1Condition && q2Condition && q3Condition && q4Condition && q5Condition) validStates.push('q5');
	return validStates;
};

const checkPasswordStrength = (pwd: string) => {
	const hasUpper = checkUpper(pwd);
	const hasLower = checkLower(pwd);
	const hasNumber = checkNumber(pwd);
	const hasSymbol = checkSymbol(pwd);
	return { hasUpper, hasLower, hasNumber, hasSymbol };
};

const PasswordDFA: React.FC = () => {
	const [input, setInput] = useState('');
	const validStates = checkPasswordState(input);
	const status = validStates.includes('q5')
		? { label: 'Password Sangat Aman', color: 'text-green-800' }
		: validStates.includes('q4')
		? { label: 'Password Aman', color: 'text-green-500' }
		: { label: 'Password Tidak Aman', color: 'text-red-600' };
	const trimmedInput = input.slice(0, maxLength);
	const lengthValid = trimmedInput.length >= minLength && trimmedInput.length <= maxLength;
	const strength = checkPasswordStrength(trimmedInput);
	const successTextColor = 'text-green-600';
	const errorTextColor = 'text-red-600';

	return (
		<>
			<div className="text-center my-10">
				<h2 className="text-2xl font-semibold mb-4">Validasi Keamanan Password DFA</h2>
				<input className="border border-gray-300 rounded px-2 py-1" type="text" value={input} onChange={(e) => setInput(e.target.value)} maxLength={maxLength} placeholder="Ketik password..." />
				<p className="mt-2 text-gray-600">Panjang: {trimmedInput.length} karakter</p>
				<ul className="text-left text-sm mt-4 mx-auto w-fit">
					<li className={strength.hasUpper ? successTextColor : errorTextColor}>{strength.hasUpper ? '✓' : '✗'} Mengandung huruf besar</li>
					<li className={strength.hasLower ? successTextColor : errorTextColor}>{strength.hasLower ? '✓' : '✗'} Mengandung huruf kecil</li>
					<li className={strength.hasNumber ? successTextColor : errorTextColor}>{strength.hasNumber ? '✓' : '✗'} Mengandung angka</li>
					<li className={strength.hasSymbol ? successTextColor : errorTextColor}>{strength.hasSymbol ? '✓' : '✗'} Mengandung simbol</li>
					<li className={lengthValid ? successTextColor : errorTextColor}>{lengthValid ? '✓' : '✗'} Panjang minimal 6 karakter</li>
				</ul>
				<p className="mt-3 text-lg font-bold">
					Status: <span className={status.color}>{status.label}</span>
				</p>
			</div>

			<CytoscapeComponent
				elements={generateElements(validStates)}
				style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
				layout={{ name: 'preset' }}
				stylesheet={[
					{
						selector: 'node',
						style: {
							content: 'data(label)',
							'text-valign': 'center',
							'text-halign': 'center',
							'background-color': '#0074D9',
							color: '#fff',
							shape: 'ellipse',
							width: 50,
							height: 50,
						},
					},
					{
						selector: '.valid',
						style: {
							'background-color': '#7FDBFF',
							'border-width': 2,
							'border-color': '#000',
						},
					},
					{
						selector: '.safe',
						style: {
							'background-color': '#2ECC40',
							'border-width': 3,
							'border-color': '#000',
						},
					},
					{
						selector: '.very-safe',
						style: {
							'background-color': '#006400',
							'border-width': 3,
							'border-color': '#000',
						},
					},
					{
						selector: 'edge',
						style: {
							label: 'data(label)',
							width: 2,
							'line-color': '#ccc',
							'target-arrow-color': '#ccc',
							'target-arrow-shape': 'triangle',
							'curve-style': 'bezier',
						},
					},
					{
						selector: '.active',
						style: {
							'line-color': '#FF4136',
							'target-arrow-color': '#FF4136',
							width: 3,
						},
					},
				]}
			/>
		</>
	);
};

export default PasswordDFA;
