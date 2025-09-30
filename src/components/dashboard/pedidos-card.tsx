
"use client";

import React from 'react';
import type { PedidosData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Trophy, ShoppingCart, Target, TrendingUp, TrendingDown, PackageWarning, MapPin } from 'lucide-react';

type PedidosCardProps = {
    data: PedidosData;
    isEditing: boolean;
    onInputChange: (path: string, value: string | number) => void;
    className?: string;
};

const RankingIcon = () => (
    <div className="relative w-8 h-8">
        <div className="absolute bottom-0 left-0 w-3 h-4 bg-gray-400 border-2 border-gray-600 rounded-t-sm"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gray-400 border-2 border-gray-600 rounded-t-sm"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-gray-600 rounded-t-sm"></div>
    </div>
);

export function PedidosCard({ data, isEditing, onInputChange, className }: PedidosCardProps) {
    const { 
        rankingNacional, 
        pedidosDia, 
        unidadesDia, 
        objetivoSemanal, 
        pedidosDiaSemanaAnterior, 
        pedidosDiaSemanaProxima,
        pedidosIpodExpirados
    } = data;
    
    const isObjectiveMet = pedidosDia >= objetivoSemanal;
    const circleColor = isObjectiveMet ? 'text-green-500' : 'text-red-500';
    const circleBgColor = isObjectiveMet ? 'bg-green-500/10' : 'bg-red-500/10';

    const progressPercentage = objetivoSemanal > 0 ? (pedidosDia / objetivoSemanal) * 100 : 0;

    const handleChange = (field: keyof PedidosData, value: string) => {
        onInputChange(`pedidos.${field}`, value);
    };
    
    return (
        <Card className={cn("p-4 font-aptos", className)}>
            <CardContent className="p-0">
                <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                    <div className="flex items-center gap-2">
                       <MapPin className="h-4 w-4" />
                       <span className="font-bold">01224_ZAR-PUERTO VENECIA</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                       <span>PED. IPOD EXPIRADOS/SEM</span>
                       {isEditing ? (
                         <Input type="number" defaultValue={pedidosIpodExpirados} onBlur={(e) => handleChange('pedidosIpodExpirados', e.target.value)} className="w-16 h-8 text-center" />
                       ) : (
                         <span className="text-xl">{pedidosIpodExpirados}</span>
                       )}
                    </div>
                </div>

                <div className="grid grid-cols-3 items-center text-center gap-4">
                    {/* Left Column */}
                    <div className="flex flex-col items-center justify-around h-full gap-8">
                        <div className="flex flex-col items-center">
                            <RankingIcon />
                            <h3 className="font-bold tracking-wider mt-1">RANKING NACIONAL</h3>
                            {isEditing ? (
                                <Input type="number" defaultValue={rankingNacional} onBlur={(e) => handleChange('rankingNacional', e.target.value)} className="w-24 h-10 text-3xl text-center mt-1" />
                            ) : (
                                <p className="text-4xl font-bold text-gray-800">#{rankingNacional}</p>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                             {isEditing ? (
                                <Input type="number" defaultValue={pedidosDiaSemanaAnterior} onBlur={(e) => handleChange('pedidosDiaSemanaAnterior', e.target.value)} className="w-24 h-10 text-3xl text-center" />
                            ) : (
                                <p className="text-4xl font-bold text-gray-500">{pedidosDiaSemanaAnterior}</p>
                            )}
                            <h4 className="text-xs font-semibold text-gray-400 mt-1">PEDIDOS/DIA SEMANA<br/>ANTERIOR</h4>
                        </div>
                    </div>

                    {/* Center Column */}
                    <div className="flex flex-col items-center justify-center">
                        <div className={cn("relative w-48 h-48 rounded-full flex items-center justify-center", circleBgColor)}>
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeDasharray={`${2 * Math.PI * 54}`}
                                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - Math.min(progressPercentage, 100) / 100)}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center text-gray-800">
                                <div className="text-xs text-gray-500">UNIDADES/DIA</div>
                                {isEditing ? (
                                    <Input type="number" defaultValue={unidadesDia} onBlur={(e) => handleChange('unidadesDia', e.target.value)} className="w-16 h-8 text-center text-lg -mt-1" />
                                ) : (
                                   <div className="text-xl font-bold -mt-1">{unidadesDia}</div>
                                )}
                                {isEditing ? (
                                    <Input type="number" defaultValue={pedidosDia} onBlur={(e) => handleChange('pedidosDia', e.target.value)} className="w-24 h-16 text-5xl text-center font-bold" />
                                ) : (
                                    <p className="text-6xl font-bold">{pedidosDia}</p>
                                )}
                                <h3 className="text-sm font-semibold tracking-wider">PEDIDOS/DIA</h3>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                            {isEditing ? (
                                <Input type="number" defaultValue={objetivoSemanal} onBlur={(e) => handleChange('objetivoSemanal', e.target.value)} className="w-20 h-8 text-center text-xl font-bold" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-800">{objetivoSemanal}</p>
                            )}
                            <h4 className="text-xs font-semibold text-gray-400">OBJETIVO SEMANAL</h4>
                        </div>
                    </div>

                    {/* Right Column */}
                     <div className="flex flex-col items-center justify-around h-full gap-8">
                        <div></div>
                        <div className="flex flex-col items-center">
                             {isEditing ? (
                                <Input type="number" defaultValue={pedidosDiaSemanaProxima} onBlur={(e) => handleChange('pedidosDiaSemanaProxima', e.target.value)} className="w-24 h-10 text-3xl text-center" />
                            ) : (
                                <p className="text-4xl font-bold text-gray-500">{pedidosDiaSemanaProxima}</p>
                            )}
                            <h4 className="text-xs font-semibold text-gray-400 mt-1">PEDIDOS/DÍA SEMANA<br/>PRÓXIMA</h4>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
