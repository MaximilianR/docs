import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import { ethers } from 'ethers';
import styles from './styles.module.css';

// Import images from the static directory
import scrvUsdLogoBig from '@site/static/img/logos/scrvUSD_round_120.png';
import scrvUsdLogoSmall from '@site/static/img/logos/scrvUSD_round_50.png';
import crvUsdLogo from '@site/static/img/logos/crvUSD_round_50.png';


// --- Smart Contract Configuration ---
const RPC_URL = 'https://eth.llamarpc.com';
const CONTRACT_ADDRESS = '0x0655977FEb2f289A4aB78af67BAB0d17aAb84367';
const ABI = [{"name":"pricePerShare","type":"function","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"name":"decimals","type":"function","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint8"}]}];
const SECONDS_IN_YEAR = 365 * 24 * 60 * 60;


export default function ScrvusdVaultAnimation() {
    // State to hold the dynamic price, initialized to 'Loading...'
    const [price, setPrice] = useState('Loading...');
    // Ref to hold the interval ID for cleanup
    const intervalRef = useRef(null);

    // Effect for running animations
    useEffect(() => {
        anime({
            targets: '.logo-line-item',
            translateX: -100,
            duration: 1000,
            easing: 'linear',
            loop: true
        });

        anime({
            targets: '#fade-in-logo',
            opacity: [0, 1],
            duration: 1000,
            easing: 'linear',
            loop: true
        });
        
        anime({
            targets: '#vault-logo',
            filter: [
                { value: 'drop-shadow(0px 0px 25px #FFC300)', duration: 10, easing: 'linear'  },
                { value: 'drop-shadow(0px 0px 0px  #FFC300)', duration: 990, easing: 'easeOutQuad' }
            ],
            strokeWidth: [
                { value: 6,   duration: 10, easing: 'linear'  },
                { value: 0,   duration: 990, easing: 'easeOutQuad' }
            ],
            strokeOpacity: [
                { value: 1,   duration: 10, easing: 'linear'  },
                { value: 0,   duration: 990, easing: 'easeOutQuad' }
            ],
            loop: true
        });
    }, []); // Empty dependency array means this runs only once after mount

    // Effect for fetching data and running the price ticker
    useEffect(() => {
        const fetchAndUpdatePrice = async () => {
            try {
                const provider = new ethers.JsonRpcProvider(RPC_URL);
                const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        
                const endTime = Math.floor(Date.now() / 1000);
                const startTime = endTime - (86400 * 7);
                const savingsApiUrl = `https://prices.curve.finance/v1/crvusd/savings/yield?agg_number=1&agg_units=hour&start=${startTime}&end=${endTime}`;
        
                const [
                    initialPriceBigInt,
                    decimals,
                    savingsResponse
                ] = await Promise.all([
                    contract.pricePerShare(),
                    contract.decimals(),
                    fetch(savingsApiUrl)
                ]);
        
                if (!savingsResponse.ok) {
                    throw new Error('Failed to fetch savings API data.');
                }
                const savingsData = await savingsResponse.json();
                const latestDataPoint = savingsData.data[savingsData.data.length - 1];
                
                const initialPrice = parseFloat(ethers.formatUnits(initialPriceBigInt, decimals));
                const yieldApy = latestDataPoint.proj_apy / 100;
                const fetchTime = Date.now();
        
                // Clear any existing interval before starting a new one
                if (intervalRef.current) clearInterval(intervalRef.current);

                // Start the interval to update the price continuously
                intervalRef.current = setInterval(() => {
                    const elapsedTimeInSeconds = (Date.now() - fetchTime) / 1000;
                    const estimatedGrowth = yieldApy * (elapsedTimeInSeconds / SECONDS_IN_YEAR);
                    const estimatedCurrentPrice = (initialPrice * (1 + estimatedGrowth));
        
                    setPrice(estimatedCurrentPrice.toFixed(11));
                }, 100);
        
            } catch (error) {
                console.error("Failed to fetch or update price:", error);
                setPrice("Error");
            }
        };

        fetchAndUpdatePrice();

        // Cleanup function: this runs when the component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // Empty dependency array, so it runs once on mount


    return (
        <div className={styles.svgContainer}>
            <svg viewBox="0 0 1400 500" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <rect width="1400" height="500" fill="none"/>

                <g filter="url(#filter0_d_304_657)">
                    <rect x="42" y="97" width="853" height="306" fill="#EEECEB"/>
                </g>
                <rect x="42" y="298" width="853" height="105" fill="#D4D0CC"/>
                <text fill="#5A554F" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Mona Sans" fontSize="36" fontWeight="500" letterSpacing="0em"><tspan x="83.8242" y="368.36">scrvUSD</tspan></text>
                <text fill="#5A554F" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Mona Sans" fontSize="36" fontWeight="bold" letterSpacing="0em"><tspan x="61.043" y="368.36">1 </tspan></text>
                <text fill="#5A554F" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Mona Sans" fontSize="36" fontWeight="500" letterSpacing="0em"><tspan x="315" y="368.36">=                                       crvUSD</tspan></text>
                
                {/* Dynamic Price Display */}
                <text fill="#5A554F" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Mona Sans" fontSize="36" fontWeight="bold" letterSpacing="0em">
                    <tspan id="dynamic-price" x="361" y="368.36">{price}</tspan>
                </text>

                <text fill="#5A554F" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Mona Sans" fontSize="64" fontWeight="600" letterSpacing="0em"><tspan x="323.75" y="230.64">scrvUSD Vault</tspan></text>

                <circle id="vault-logo" cx="842" cy="354" r="25" fill="url(#pattern_crvusd_logo_vault)" filter="url(#glow-shadow)" stroke="#FFC300" strokeWidth="5" strokeOpacity="1" />

                <rect className="logo-line-item" x="917" y="329" width="50" height="50" fill="url(#pattern_crvusd_logo_line_0)"/>
                <rect className="logo-line-item" x="1017" y="329" width="50" height="50" fill="url(#pattern_crvusd_logo_line_1)"/>
                <rect className="logo-line-item" x="1117" y="329" width="50" height="50" fill="url(#pattern_crvusd_logo_line_2)"/>
                <rect className="logo-line-item" x="1217" y="329" width="50" height="50" fill="url(#pattern_crvusd_logo_line_3)"/>
                <rect className="logo-line-item" id="fade-in-logo" x="1317" y="329" width="50" height="50" fill="url(#pattern_crvusd_logo_line_4)"/>

                <rect x="166" y="139" width="120" height="120" fill="url(#pattern_scrvusd_logo_big)"/>
                <rect x="246" y="329" width="50" height="50" fill="url(#pattern_scrvusd_logo_small)"/>

                <defs>
                    <filter id="filter0_d_304_657" x="38" y="97" width="861" height="314" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_304_657"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_304_657" result="shape"/>
                    </filter>
                    <pattern id="pattern_scrvusd_logo_big" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_scrvusd_logo_big" transform="scale(0.00833333)"/>
                    </pattern>
                    <pattern id="pattern_scrvusd_logo_small" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_scrvusd_logo_small" transform="scale(0.02)"/>
                    </pattern>
                    <pattern id="pattern_crvusd_logo_vault" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_crvusd_logo" transform="scale(0.02)"/>
                    </pattern>
                    <pattern id="pattern_crvusd_logo_line_0" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_crvusd_logo" transform="scale(0.02)"/>
                    </pattern>
                    <pattern id="pattern_crvusd_logo_line_1" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_crvusd_logo" transform="scale(0.02)"/>
                    </pattern>
                    <pattern id="pattern_crvusd_logo_line_2" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_crvusd_logo" transform="scale(0.02)"/>
                    </pattern>
                    <pattern id="pattern_crvusd_logo_line_3" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_crvusd_logo" transform="scale(0.02)"/>
                    </pattern>
                    <pattern id="pattern_crvusd_logo_line_4" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#img_crvusd_logo" transform="scale(0.02)"/>
                    </pattern>
                    
                    <image id="img_scrvusd_logo_big" width="120" height="120" preserveAspectRatio="none" xlinkHref={scrvUsdLogoBig}/>
                    <image id="img_scrvusd_logo_small" width="50" height="50" preserveAspectRatio="none" xlinkHref={scrvUsdLogoSmall}/>
                    <image id="img_crvusd_logo" width="50" height="50" preserveAspectRatio="none" xlinkHref={crvUsdLogo}/>
                </defs>
            </svg>
        </div>
    );
}