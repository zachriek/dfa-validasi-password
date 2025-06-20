'use client';

import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Shield, Lock, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import CytoscapeComponent from 'react-cytoscapejs';
import { ElementDefinition } from 'cytoscape';

const states = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'];
const minLength = 6;
const maxLength = 50;

const generateElements = (validStates: string[]): ElementDefinition[] => {
	const nodes: ElementDefinition[] = states.map((id, index) => ({
		data: { id, label: id },
		position: { x: index * 120 + 50, y: 100 },
		classes: validStates.includes(id) ? (id === 'q4' ? 'safe' : id === 'q5' ? 'very-safe' : 'valid') : ['q4', 'q5'].includes(id) ? 'final-state' : '',
	}));

	const transitions: ElementDefinition[] = [
		// q0
		{ data: { source: 'q0', target: 'q1', label: 'b', id: 'e0-1', type: 'valid-state' } },
		{ data: { source: 'q0', target: 'q0', label: 'a, c, d, e, f, g, h, i, j', id: 'e0-0', type: 'invalid-state' } },

		// q1
		{ data: { source: 'q1', target: 'q2', label: 'c', id: 'e1-2', type: 'valid-state' } },
		{ data: { source: 'q1', target: 'q0', label: 'a', id: 'e1-0', type: 'invalid-state' } },
		{ data: { source: 'q1', target: 'q1', label: 'b, d, e, f, g, h, i, j', id: 'e1-1', type: 'invalid-state' } },

		// q2
		{ data: { source: 'q2', target: 'q3', label: 'e', id: 'e2-3', type: 'valid-state' } },
		{ data: { source: 'q2', target: 'q0', label: 'a', id: 'e2-0', type: 'invalid-state' } },
		{ data: { source: 'q2', target: 'q1', label: 'd', id: 'e2-1', type: 'invalid-state' } },
		{ data: { source: 'q2', target: 'q2', label: 'b, c, f, g, h, i, j', id: 'e2-2', type: 'invalid-state' } },

		// q3
		{ data: { source: 'q3', target: 'q4', label: 'g', id: 'e3-4', type: 'valid-state' } },
		{ data: { source: 'q3', target: 'q0', label: 'a', id: 'e3-0', type: 'invalid-state' } },
		{ data: { source: 'q3', target: 'q1', label: 'd', id: 'e3-1', type: 'invalid-state' } },
		{ data: { source: 'q3', target: 'q2', label: 'f', id: 'e3-2', type: 'invalid-state' } },
		{ data: { source: 'q3', target: 'q3', label: 'b, c, e, h, i, j', id: 'e3-3', type: 'invalid-state' } },

		// q4
		{ data: { source: 'q4', target: 'q5', label: 'i', id: 'e4-5', type: 'valid-state' } },
		{ data: { source: 'q4', target: 'q0', label: 'a', id: 'e4-0', type: 'invalid-state' } },
		{ data: { source: 'q4', target: 'q1', label: 'd', id: 'e4-1', type: 'invalid-state' } },
		{ data: { source: 'q4', target: 'q2', label: 'f', id: 'e4-2', type: 'invalid-state' } },
		{ data: { source: 'q4', target: 'q3', label: 'h', id: 'e4-3', type: 'invalid-state' } },
		{ data: { source: 'q4', target: 'q4', label: 'b, c, e, g, j', id: 'e4-4', type: 'invalid-state' } },

		// q5
		{ data: { source: 'q5', target: 'q0', label: 'a', id: 'e5-0', type: 'invalid-state' } },
		{ data: { source: 'q5', target: 'q1', label: 'd', id: 'e5-1', type: 'invalid-state' } },
		{ data: { source: 'q5', target: 'q2', label: 'f', id: 'e5-2', type: 'invalid-state' } },
		{ data: { source: 'q5', target: 'q3', label: 'h', id: 'e5-3', type: 'invalid-state' } },
		{ data: { source: 'q5', target: 'q5', label: 'b, c, e, g, i', id: 'e5-5', type: 'valid-state' } },
		{ data: { source: 'q5', target: 'q4', label: 'j', id: 'e5-4', type: 'invalid-state' } },
	].map((edge) => ({
		data: edge.data,
		classes: edge.data.type === 'valid-state' && validStates.includes(edge.data.source) && validStates.includes(edge.data.target) ? 'active' : '',
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
	const [showPassword, setShowPassword] = useState(false);

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

	const dfaStates = useMemo(() => {
		const uppercaseCount = (trimmedInput.match(/[A-Z]/g) || []).length;
		const lowercaseCount = (trimmedInput.match(/[a-z]/g) || []).length;
		const numberCount = (trimmedInput.match(/[0-9]/g) || []).length;
		const symbolCount = (trimmedInput.match(/[^A-Za-z0-9]/g) || []).length;

		return {
			a: trimmedInput.length < 6,
			b: trimmedInput.length >= 6,
			c: lowercaseCount >= 1,
			d: lowercaseCount === 0,
			e: numberCount >= 1,
			f: numberCount === 0,
			g: uppercaseCount >= 1,
			h: uppercaseCount === 0,
			i: symbolCount >= 1,
			j: symbolCount === 0,
		};
	}, [trimmedInput]);

	// States untuk DFA
	const currentStates = useMemo(() => {
		return {
			q0: true, // Initial state
			q1: validStates.includes('q1'), // Length >= 6
			q2: validStates.includes('q2'), // Has lowercase
			q3: validStates.includes('q3'), // Has uppercase
			q4: validStates.includes('q4'), // Has number
			q5: validStates.includes('q5'), // Has symbol (final accepting state)
		};
	}, [validStates]);

	const getStateColor = (state: boolean) => {
		return state ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
				<div className="max-w-4xl mx-auto">
					<div className="bg-white rounded-2xl shadow-xl p-8">
						{/* Header */}
						<div className="text-center mb-8">
							<div className="flex items-center justify-center mb-4">
								<Shield className="w-12 h-12 text-indigo-600 mr-3" />
								<h1 className="text-3xl font-bold text-gray-800">DFA Validasi Keamanan Password</h1>
							</div>
							<p className="text-gray-600">Masukkan password untuk menganalisis keamanan menggunakan Deterministic Finite Automata</p>
						</div>

						{/* Input Section */}
						<div className="mb-8">
							<div className="relative">
								<input
									className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 pr-12 text-lg focus:border-indigo-500 focus:outline-none transition-colors"
									type={showPassword ? 'text' : 'password'}
									value={input}
									onChange={(e) => setInput(e.target.value)}
									maxLength={maxLength}
									placeholder="Ketik password Anda di sini..."
								/>
								<button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
									{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
							<div className="flex justify-between items-center mt-2">
								<p className="text-sm text-gray-600">Panjang: {trimmedInput.length} karakter</p>
								<p className="text-sm text-gray-500">{maxLength - input.length} karakter tersisa</p>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-8">
							{/* Validation Rules */}
							<div className="bg-gray-50 rounded-xl p-6">
								<h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
									<Lock className="w-5 h-5 mr-2" />
									Kriteria Validasi
								</h3>
								<ul className="space-y-3">
									<li className={`flex items-center p-3 rounded-lg ${strength.hasUpper ? 'bg-green-100 ' + successTextColor : 'bg-red-100 ' + errorTextColor}`}>
										{strength.hasUpper ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
										Mengandung huruf besar
									</li>
									<li className={`flex items-center p-3 rounded-lg ${strength.hasLower ? 'bg-green-100 ' + successTextColor : 'bg-red-100 ' + errorTextColor}`}>
										{strength.hasLower ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
										Mengandung huruf kecil
									</li>
									<li className={`flex items-center p-3 rounded-lg ${strength.hasNumber ? 'bg-green-100 ' + successTextColor : 'bg-red-100 ' + errorTextColor}`}>
										{strength.hasNumber ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
										Mengandung angka
									</li>
									<li className={`flex items-center p-3 rounded-lg ${strength.hasSymbol ? 'bg-green-100 ' + successTextColor : 'bg-red-100 ' + errorTextColor}`}>
										{strength.hasSymbol ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
										Mengandung simbol
									</li>
									<li className={`flex items-center p-3 rounded-lg ${lengthValid ? 'bg-green-100 ' + successTextColor : 'bg-red-100 ' + errorTextColor}`}>
										{lengthValid ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
										Panjang {minLength}-{maxLength} karakter
									</li>
								</ul>
							</div>

							{/* DFA States */}
							<div className="bg-gray-50 rounded-xl p-6">
								<h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
									<Clock className="w-5 h-5 mr-2" />
									Status DFA
								</h3>

								{/* DFA State Transition */}
								<div className="mb-4">
									<h4 className="font-medium mb-2 text-gray-700">State Transisi:</h4>
									<div className="grid grid-cols-2 gap-2 text-sm mb-4">
										<div className={`p-2 rounded border font-mono ${currentStates.q0 ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-100 text-gray-600'}`}>q0: Initial State</div>
										<div className={`p-2 rounded border font-mono ${currentStates.q1 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600'}`}>q1: Length ≥ 6</div>
										<div className={`p-2 rounded border font-mono ${currentStates.q2 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600'}`}>q2: Has Lowercase</div>
										<div className={`p-2 rounded border font-mono ${currentStates.q3 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600'}`}>q3: Has Number</div>
										<div className={`p-2 rounded border font-mono ${currentStates.q4 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600'}`}>q4: Has Uppercase</div>
										<div className={`p-2 rounded border font-mono ${currentStates.q5 ? 'bg-green-100 text-green-800 border-green-300 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600'}`}>
											q5: Has Symbol
										</div>
									</div>
								</div>

								{/* Input Conditions */}
								<div>
									<h4 className="font-medium mb-2 text-gray-700">Kondisi Input:</h4>
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.a)}`}>a: input &lt; 6 → {dfaStates.a ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.b)}`}>b: input ≥ 6 → {dfaStates.b ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.c)}`}>c: lowercase ≥ 1 → {dfaStates.c ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.d)}`}>d: lowercase = 0 → {dfaStates.d ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.e)}`}>e: number ≥ 1 → {dfaStates.e ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.f)}`}>f: number = 0 → {dfaStates.f ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.g)}`}>g: uppercase ≥ 1 → {dfaStates.g ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.h)}`}>h: uppercase = 0 → {dfaStates.h ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.i)}`}>i: symbol ≥ 1 → {dfaStates.i ? 'TRUE' : 'FALSE'}</div>
										<div className={`p-2 rounded border font-mono ${getStateColor(dfaStates.j)}`}>j: symbol = 0 → {dfaStates.j ? 'TRUE' : 'FALSE'}</div>
									</div>
								</div>
							</div>
						</div>

						{/* Status */}
						<div className="mt-8 text-center">
							<div
								className={`inline-flex items-center px-6 py-3 rounded-full text-xl font-bold ${
									validStates.includes('q5') ? 'bg-green-100 text-green-800' : validStates.includes('q4') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-800'
								}`}
							>
								{validStates.includes('q4') ? <CheckCircle className="w-6 h-6 mr-2" /> : <AlertCircle className="w-6 h-6 mr-2" />}
								Status: <span className={status.color}>{status.label}</span>
							</div>
							<p className="mt-2 text-gray-600">
								{validStates.includes('q5')
									? 'Password Anda sangat aman dengan semua kriteria terpenuhi!'
									: validStates.includes('q4')
									? 'Password Anda cukup aman, tapi akan lebih baik dengan simbol.'
									: 'Password Anda belum memenuhi kriteria keamanan yang diperlukan.'}
							</p>
							<p className="mt-1 text-sm text-gray-500">Current DFA State: {validStates[validStates.length - 1] || 'q0'}</p>
						</div>

						{/* Progress Bar */}
						<div className="mt-6">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-gray-600">Progres Keamanan</span>
								<span className="text-sm text-gray-600">
									{Math.round((((lengthValid ? 1 : 0) + (strength.hasUpper ? 1 : 0) + (strength.hasLower ? 1 : 0) + (strength.hasNumber ? 1 : 0) + (strength.hasSymbol ? 1 : 0)) / 5) * 100)}%
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3">
								<div
									className={`h-3 rounded-full transition-all duration-300 ${validStates.includes('q5') ? 'bg-green-500' : validStates.includes('q4') ? 'bg-yellow-500' : 'bg-red-500'}`}
									style={{ width: `${(((lengthValid ? 1 : 0) + (strength.hasUpper ? 1 : 0) + (strength.hasLower ? 1 : 0) + (strength.hasNumber ? 1 : 0) + (strength.hasSymbol ? 1 : 0)) / 5) * 100}%` }}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<CytoscapeComponent
				elements={generateElements(validStates)}
				style={{ width: '100%', height: '1000px', border: '1px solid #ccc' }}
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
						selector: '.final-state',
						style: {
							'background-color': '#0074D9',
							'border-width': 2,
							'border-color': '#000',
						},
					},
					{
						selector: '.valid',
						style: {
							'background-color': '#00B7FF',
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
							'line-color': '#36FF47',
							'target-arrow-color': '#36FF47',
							width: 3,
						},
					},
				]}
			/>
		</>
	);
};

export default PasswordDFA;
