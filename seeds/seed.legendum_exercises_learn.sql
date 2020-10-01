BEGIN;

TRUNCATE
    legendum_exercises_learn
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING to 'utf8';

INSERT INTO legendum_exercises_learn (chapter_number, page, text, image_url, image_alt_text, background_image_url, background_image_alt_text)
VALUES
    (1, 1, 'Lūcius: “Salvē!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dYaZ1TU_wVYNQ2GpPE-KSD56h6ULoUsm0gaQkmB0ntMvb7KX_6In2wKBoNMN9IOhG1LWpMVqx5cd7Y8teYu_4A9TrLx7o3CcGfIO-dKPd8_lZ9larkv1z4oFfIAuBObjccseigTDdr_N38rOKzfp0=s600-no?authuser=2', 'A man named Lucius speaks to a woman named Iulia.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 2, 'Lūcius: “Egō sum Lūcius!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dYaZ1TU_wVYNQ2GpPE-KSD56h6ULoUsm0gaQkmB0ntMvb7KX_6In2wKBoNMN9IOhG1LWpMVqx5cd7Y8teYu_4A9TrLx7o3CcGfIO-dKPd8_lZ9larkv1z4oFfIAuBObjccseigTDdr_N38rOKzfp0=s600-no?authuser=2', 'A man named Lucius speaks to a woman named Iulia.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 3, 'Lūcius: “Nōmen mihi est Lūcius!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dYaZ1TU_wVYNQ2GpPE-KSD56h6ULoUsm0gaQkmB0ntMvb7KX_6In2wKBoNMN9IOhG1LWpMVqx5cd7Y8teYu_4A9TrLx7o3CcGfIO-dKPd8_lZ9larkv1z4oFfIAuBObjccseigTDdr_N38rOKzfp0=s600-no?authuser=2', 'A man named Lucius speaks to a woman named Iulia.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 4, 'Iūlia: “Salvē, Lūcī!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dKFMPSsLPEigYgPCIkOPtgEt6E9fJ_SLWUOeQJBFokLcrP3SUCAS1XRWzITZAwiZvUyvdywINf927bV78q42ad_0ws-CPZxvR5fiKj1-tODH3MBxfgQVwsyY8YsceJPxXPBKQayUT7RdmSNJJwvP8=s600-no?authuser=2', 'A woman named Iulia speaks to a man named Lucius.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 5, 'Lūcius: “Quid est nōmen tibi?”', 'https://lh3.googleusercontent.com/pw/ACtC-3dYaZ1TU_wVYNQ2GpPE-KSD56h6ULoUsm0gaQkmB0ntMvb7KX_6In2wKBoNMN9IOhG1LWpMVqx5cd7Y8teYu_4A9TrLx7o3CcGfIO-dKPd8_lZ9larkv1z4oFfIAuBObjccseigTDdr_N38rOKzfp0=s600-no?authuser=2', 'A man named Lucius speaks to a woman named Iulia.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 6, 'Iūlia: “Nōmen mihi est Iūlia.  Ego sum Iūlia.”', 'https://lh3.googleusercontent.com/pw/ACtC-3dKFMPSsLPEigYgPCIkOPtgEt6E9fJ_SLWUOeQJBFokLcrP3SUCAS1XRWzITZAwiZvUyvdywINf927bV78q42ad_0ws-CPZxvR5fiKj1-tODH3MBxfgQVwsyY8YsceJPxXPBKQayUT7RdmSNJJwvP8=s600-no?authuser=2', 'A woman named Iulia speaks to a man named Lucius.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 7, 'Lūcius: “Salvē, Iūlia! Pergrātum tē convenīre!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dYaZ1TU_wVYNQ2GpPE-KSD56h6ULoUsm0gaQkmB0ntMvb7KX_6In2wKBoNMN9IOhG1LWpMVqx5cd7Y8teYu_4A9TrLx7o3CcGfIO-dKPd8_lZ9larkv1z4oFfIAuBObjccseigTDdr_N38rOKzfp0=s600-no?authuser=2', 'A man named Lucius speaks to a woman named Iulia.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 8, 'Iūlia: “Pergrātum quoque tē convenīre!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dKFMPSsLPEigYgPCIkOPtgEt6E9fJ_SLWUOeQJBFokLcrP3SUCAS1XRWzITZAwiZvUyvdywINf927bV78q42ad_0ws-CPZxvR5fiKj1-tODH3MBxfgQVwsyY8YsceJPxXPBKQayUT7RdmSNJJwvP8=s600-no?authuser=2', 'A woman named Iulia speaks to a man named Lucius.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 9, 'Lūcius et Iūlia: “Valē!”', 'https://lh3.googleusercontent.com/pw/ACtC-3dq-clJGd33zvaJ0G9JdrSD62IA35PmjoQy4GkOZvzSaNLYx6_JTFWXpVxtVemWAI761f0qyWWB7UkZN-Q6nV1AUmiO8nrX2iWqu_8GMGtQx3QcJD_kemHt86kaYfIczyagg0UtDm0M__ZetpEA9So=s600-no?authuser=2', 'Lucius and Iulia speak at the same time.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 10, '(Lūcius exit.)', 'https://lh3.googleusercontent.com/pw/ACtC-3fHLfPVrVb62lS4ljqzoXvuHPsPfKoDMQMtZMIKEKBea4pT7vIzSnNxZ4pAI0eFs-Ump-k_vVd7wRd7_U7eOBAksovU0wD4JO3-VyrugIDzzS1PlC4ivy7j_dZNvVM3OCrZygQM8yTb9nLopPO5YiU=s600-no?authuser=2', 'Lucius leaves and Iulia remains.', 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (1, 11, '(Iūlia exit.)', null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3diNCdnhH9P5Et2cmOMWraVXbbbQOZoq9IRBUYcadNl7JNFyVQ9W1WXJed9-6SLCiGc5yaxC1Ui4KKwOli-yA9TXO48dY3H-5Wqw1bRmEugP9VW4yhXrCAoNzXlZ1hb74S4KWVJ-kbdjZLgl-r1IV3F=w1178-h883-no?authuser=2', 'A sunny day in the Italian countryside.'),
    (2, 1, 'Haec est Rōma.', 'https://lh3.googleusercontent.com/pw/ACtC-3eHX77M_Pjlx3_1DrbXlPjqoL_kk0OAln0q1RjJ2LssZA-mgO1AQMk_8HMgdncU_4b8T-ebJgxffhcg79il02j1stSFJx97SXMX_zg5CPB3CPzvfJ_9c1H4RHWvF0B-sVCn3C0UACX1qx5PjGM_v_YT=w937-h849-no?authuser=2', 'Map of Italy with Rome circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 2, 'Haec est Italia.', 'https://lh3.googleusercontent.com/pw/ACtC-3dqAEXvG1S1NkpZD1zd8kc5p09hRbxX4Ow8apBr97uo8qbvt9lpeIjLKH_ka8wjlfAUqTjQTIKdOvGxiDJF4f5HyzuHfsHCTt0p0WB9qwORIkp-AASDzHxLi6_YHLsxwGpg4vT-tQ0XEOMXg4986CI9=w1180-h849-no?authuser=2', 'Map of Europe with Italy circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 3, 'Italia est in Eurōpā.', 'https://lh3.googleusercontent.com/pw/ACtC-3dqAEXvG1S1NkpZD1zd8kc5p09hRbxX4Ow8apBr97uo8qbvt9lpeIjLKH_ka8wjlfAUqTjQTIKdOvGxiDJF4f5HyzuHfsHCTt0p0WB9qwORIkp-AASDzHxLi6_YHLsxwGpg4vT-tQ0XEOMXg4986CI9=w1180-h849-no?authuser=2', 'Map of Europe with Italy circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 4, 'Rōma in Italiā est.', 'https://lh3.googleusercontent.com/pw/ACtC-3eHX77M_Pjlx3_1DrbXlPjqoL_kk0OAln0q1RjJ2LssZA-mgO1AQMk_8HMgdncU_4b8T-ebJgxffhcg79il02j1stSFJx97SXMX_zg5CPB3CPzvfJ_9c1H4RHWvF0B-sVCn3C0UACX1qx5PjGM_v_YT=w937-h849-no?authuser=2', 'Map of Italy with Rome circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 5, 'Haec est Hispānia.', 'https://lh3.googleusercontent.com/pw/ACtC-3daerp8w4whSXofk86hh02a2AxPDAQ-tLKZVoVlERX-SD6JbGX4aesadYZsVCxEgUFOKJKK2TxCwSw-6JYFAAh4JY-Ie7QkC5iM-oXcYq3XW7rvPonHd2pj6TTMe74QhmQsZIk0rVWFuIzvnXdeZEMD=w1043-h849-no?authuser=2', 'Map of Europe with Spain circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 6, 'Hispānia est in Eurōpā.', 'https://lh3.googleusercontent.com/pw/ACtC-3daerp8w4whSXofk86hh02a2AxPDAQ-tLKZVoVlERX-SD6JbGX4aesadYZsVCxEgUFOKJKK2TxCwSw-6JYFAAh4JY-Ie7QkC5iM-oXcYq3XW7rvPonHd2pj6TTMe74QhmQsZIk0rVWFuIzvnXdeZEMD=w1043-h849-no?authuser=2', 'Map of Europe with Spain circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 7, 'Haec est Graecia.', 'https://lh3.googleusercontent.com/pw/ACtC-3ddhsIjTKQJno1YSKrWfxi109w_SWlS96UA8Jrd0SXsuOsfovdn6Ccf27Glszv4HazVzzfPPyPkqxXDhZWYXAI2HKM0gNsGMeA6ajMC_T5OApocdUZeFi3rTsdtaXiCsZdhM1lulUkrVBoAwRRwl_JG=w1076-h849-no?authuser=2', 'Map of Europe with Greece circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 8, 'Graecia quoque in Eurōpā est.', 'https://lh3.googleusercontent.com/pw/ACtC-3ddhsIjTKQJno1YSKrWfxi109w_SWlS96UA8Jrd0SXsuOsfovdn6Ccf27Glszv4HazVzzfPPyPkqxXDhZWYXAI2HKM0gNsGMeA6ajMC_T5OApocdUZeFi3rTsdtaXiCsZdhM1lulUkrVBoAwRRwl_JG=w1076-h849-no?authuser=2', 'Map of Europe with Greece circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 9, 'Hispānia et Italia et Graecia in Eurōpā sunt.', 'https://lh3.googleusercontent.com/pw/ACtC-3dQIXZCUhg7kvivpUODB5pmBndRxg9oM02OQU24TCeXD-1V8s1BBYwY-F_C7xSMq45n86wkhgwRIkxzQC0wocYApOsGMTpZW-oS4SkfVGRqHafQSvWCyfqDtF28wnvd6o7AcwJDnFOccUlUA7wqykYi=w1184-h849-no?authuser=2', 'Map of Europe with Spain, Italy, and Greece circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 10, 'Hīc est Aegyptus.', 'https://lh3.googleusercontent.com/pw/ACtC-3fn8a4MadW40d4nXXASh6-DwQ37UmKHtF2q7lTklNovmrjqWINJxSC3UvbMCI8vDWlrGE3QxECG3a62lMReriPGQrWsQ7Minanl44nqnrkO6X-dwz_4vLmwll6WJCGDfPJyniyPDTQFaiG65rCS-rqC=w1343-h849-no?authuser=2', 'Map with Egypt circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 11, 'Aegyptus est in Āfricā.', 'https://lh3.googleusercontent.com/pw/ACtC-3fn8a4MadW40d4nXXASh6-DwQ37UmKHtF2q7lTklNovmrjqWINJxSC3UvbMCI8vDWlrGE3QxECG3a62lMReriPGQrWsQ7Minanl44nqnrkO6X-dwz_4vLmwll6WJCGDfPJyniyPDTQFaiG65rCS-rqC=w1343-h849-no?authuser=2', 'Map with Egypt circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 12, 'Haec est Gallia.', 'https://lh3.googleusercontent.com/pw/ACtC-3dGIV0p_jbqVOrN2-y1kjOZ0F08-K5U7P63gH-lDu_X879CiCSy0VQs9ZvrZq3MmkqAQSLtuaubOGsq1kp1nGHj_vapaXuk2EvU-NwzS5HD7ZXDKJ4qiQUDHkDKCWJuM4GIyz3GUWpH_hK1PmnF9Pn7=w1110-h849-no?authuser=2', 'Map of Europe with Gaul circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 13, 'Gallia nōn in Āfricā sed in Eurōpā est.', 'https://lh3.googleusercontent.com/pw/ACtC-3dGIV0p_jbqVOrN2-y1kjOZ0F08-K5U7P63gH-lDu_X879CiCSy0VQs9ZvrZq3MmkqAQSLtuaubOGsq1kp1nGHj_vapaXuk2EvU-NwzS5HD7ZXDKJ4qiQUDHkDKCWJuM4GIyz3GUWpH_hK1PmnF9Pn7=w1110-h849-no?authuser=2', 'Map of Europe with Gaul circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 14, 'Syria et Arabia nōn in Eurōpā aut in Āfricā sed in Asiā sunt.', 'https://lh3.googleusercontent.com/pw/ACtC-3ceVYR9BLBYT86-tfoF9PC4tTKaMlB9-OXgCXcz8UbaPZkE1OXl7MIJrFdrFvA8oZc7PSrLwcfqTdh5e1ladhBqjL6C1_h6sgVo2nneWSSLjknUcGFE--YyhKsblkPrAu4iUGqKiJRum6IYjGoDJ7-q=w959-h603-no?authuser=2', 'Map with Syria and Arabia circled.', 'https://lh3.googleusercontent.com/pw/ACtC-3c56GTnSjywKqHobOBYnFDsEU-wiD9n5EQ_uk_ChYNihApwfyvtBTfonPSz9VvjOpLHyD7_0WZEEOMOG5NsmtEYyvX0ybl3SZ3AQTsoXLqE5KSEF4eePQLMswF0qq1dPjHT0mvzFahgXXQKnUEgiq11=w1178-h883-no?authuser=2', 'You are in a typical Roman room with a decorated floor and painted walls.')
    ;

COMMIT;