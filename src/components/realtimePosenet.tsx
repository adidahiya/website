import * as posenet from "@tensorflow-models/posenet";
import dat from "dat.gui";
import React from "react";
import Stats from "stats.js";

import { drawBoundingBox, drawKeypoints, drawSkeleton } from "../common/posenetUtils";

export interface IRealtimePosenetProps {
    videoHeight: number;
    videoWidth: number;
}

export default class extends React.PureComponent<IRealtimePosenetProps> {
    private canvasElement?: HTMLCanvasElement;
    private videoElement?: HTMLVideoElement;

    private guiState: any = {
        algorithm: "multi-pose",
        input: {
            mobileNetArchitecture: "0.75",
            outputStride: 16,
            imageScaleFactor: 0.5,
        },
        singlePoseDetection: {
            minPoseConfidence: 0.1,
            minPartConfidence: 0.5,
        },
        multiPoseDetection: {
            maxPoseDetections: 5,
            minPoseConfidence: 0.15,
            minPartConfidence: 0.1,
            nmsRadius: 30.0,
        },
        output: {
            showVideo: true,
            showSkeleton: true,
            showPoints: true,
            showBoundingBox: false,
        },
        net: null,
    };
    private stats?: Stats;

    private refHandlers = {
        canvas: (r: HTMLCanvasElement) => (this.canvasElement = r),
        video: (r: HTMLVideoElement) => (this.videoElement = r),
    };

    public async componentDidMount() {
        // Load the PoseNet model weights with architecture 0.75
        const net = await posenet.load(0.75);

        // document.getElementById("loading").style.display = "none";
        // document.getElementById("main").style.display = "block";

        let video;

        try {
            video = await this.loadVideo();
        } catch (e) {
            console.error(
                "this browser does not support video capture, or this device does not have a camera",
            );
            throw e;
        }

        this.stats = new Stats();
        this.setupGui([], net);
        this.setupFPS(this.stats);
        this.detectPoseInRealtime(video, net);
    }

    public render() {
        const { videoHeight, videoWidth } = this.props;
        return (
            <>
                <video
                    ref={this.refHandlers.video}
                    playsInline={true}
                    style={{
                        transform: "scaleX(-1)",
                        display: "none",
                    }}
                />
                <canvas ref={this.refHandlers.canvas} width={videoWidth} height={videoHeight} />
            </>
        );
    }

    private async loadVideo() {
        const video = await this.setupCamera();
        this.videoElement!.play();
        return video;
    }

    private async setupCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");
        }

        const { videoHeight, videoWidth } = this.props;

        this.videoElement!.width = videoWidth;
        this.videoElement!.height = videoHeight;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: "user",
                width: videoWidth,
                height: videoHeight,
            },
        });
        this.videoElement!.srcObject = stream;

        return new Promise(resolve => {
            this.videoElement!.onloadedmetadata = () => {
                resolve(this.videoElement);
            };
        });
    }

    private async setupGui(cameras: any[], net: any) {
        this.guiState.net = net;

        if (cameras.length > 0) {
            this.guiState.camera = cameras[0].deviceId;
        }

        const gui = new dat.GUI({ width: 300 });

        // The single-pose algorithm is faster and simpler but requires only one
        // person to be in the frame or results will be innaccurate. Multi-pose works
        // for more than 1 person
        const algorithmController = gui.add(this.guiState, "algorithm", [
            "single-pose",
            "multi-pose",
        ]);

        // The input parameters have the most effect on accuracy and speed of the
        // network
        const input = gui.addFolder("Input");
        // Architecture: there are a few PoseNet models varying in size and
        // accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
        // fastest, but least accurate.
        const architectureController = input.add(this.guiState.input, "mobileNetArchitecture", [
            "1.01",
            "1.00",
            "0.75",
            "0.50",
        ]);
        // Output stride:  Internally, this parameter affects the height and width of
        // the layers in the neural network. The lower the value of the output stride
        // the higher the accuracy but slower the speed, the higher the value the
        // faster the speed but lower the accuracy.
        input.add(this.guiState.input, "outputStride", [8, 16, 32]);
        // Image scale factor: What to scale the image by before feeding it through
        // the network.
        input
            .add(this.guiState.input, "imageScaleFactor")
            .min(0.2)
            .max(1.0);
        input.open();

        // Pose confidence: the overall confidence in the estimation of a person's
        // pose (i.e. a person detected in a frame)
        // Min part confidence: the confidence that a particular estimated keypoint
        // position is accurate (i.e. the elbow's position)
        const single = gui.addFolder("Single Pose Detection");
        single.add(this.guiState.singlePoseDetection, "minPoseConfidence", 0.0, 1.0);
        single.add(this.guiState.singlePoseDetection, "minPartConfidence", 0.0, 1.0);

        const multi = gui.addFolder("Multi Pose Detection");
        multi
            .add(this.guiState.multiPoseDetection, "maxPoseDetections")
            .min(1)
            .max(20)
            .step(1);
        multi.add(this.guiState.multiPoseDetection, "minPoseConfidence", 0.0, 1.0);
        multi.add(this.guiState.multiPoseDetection, "minPartConfidence", 0.0, 1.0);
        // nms Radius: controls the minimum distance between poses that are returned
        // defaults to 20, which is probably fine for most use cases
        multi
            .add(this.guiState.multiPoseDetection, "nmsRadius")
            .min(0.0)
            .max(40.0);
        multi.open();

        const output = gui.addFolder("Output");
        output.add(this.guiState.output, "showVideo");
        output.add(this.guiState.output, "showSkeleton");
        output.add(this.guiState.output, "showPoints");
        output.add(this.guiState.output, "showBoundingBox");
        output.open();

        architectureController.onChange((architecture: any) => {
            this.guiState.changeToArchitecture = architecture;
        });

        algorithmController.onChange((_value: any) => {
            switch (this.guiState.algorithm) {
                case "single-pose":
                    multi.close();
                    single.open();
                    break;
                case "multi-pose":
                    single.close();
                    multi.open();
                    break;
            }
        });
    }

    private setupFPS(stats: Stats) {
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
    }

    /**
     * Feeds an image to posenet to estimate poses - this is where the magic
     * happens. This function loops with a requestAnimationFrame method.
     */
    private detectPoseInRealtime(_video: any, _net: any) {
        const ctx = this.canvasElement!.getContext("2d");
        // since images are being fed from a webcam
        const flipHorizontal = true;

        // this.canvasElement.width = videoWidth;
        // this.canvasElement.height = videoHeight;

        this.poseDetectionFrame(ctx!, flipHorizontal);
    }

    private poseDetectionFrame = async (ctx: CanvasRenderingContext2D, flipHorizontal: boolean) => {
        if (this.guiState.changeToArchitecture) {
            // Important to purge variables and free up GPU memory
            this.guiState.net.dispose();

            // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
            // version
            this.guiState.net = await posenet.load(+this.guiState.changeToArchitecture as any);

            this.guiState.changeToArchitecture = null;
        }

        // Begin monitoring code for frames per second
        this.stats!.begin();

        // Scale an image down to a certain factor. Too large of an image will slow
        // down the GPU
        const imageScaleFactor = this.guiState.input.imageScaleFactor;
        const outputStride = +this.guiState.input.outputStride;

        let poses = [];
        let minPoseConfidence: number;
        let minPartConfidence: number;
        switch (this.guiState.algorithm) {
            case "single-pose":
                const pose = await this.guiState.net.estimateSinglePose(
                    this.videoElement,
                    imageScaleFactor,
                    flipHorizontal,
                    outputStride,
                );
                poses.push(pose);

                minPoseConfidence = +this.guiState.singlePoseDetection.minPoseConfidence;
                minPartConfidence = +this.guiState.singlePoseDetection.minPartConfidence;
                break;
            case "multi-pose":
                poses = await this.guiState.net.estimateMultiplePoses(
                    this.videoElement,
                    imageScaleFactor,
                    flipHorizontal,
                    outputStride,
                    this.guiState.multiPoseDetection.maxPoseDetections,
                    this.guiState.multiPoseDetection.minPartConfidence,
                    this.guiState.multiPoseDetection.nmsRadius,
                );

                minPoseConfidence = +this.guiState.multiPoseDetection.minPoseConfidence;
                minPartConfidence = +this.guiState.multiPoseDetection.minPartConfidence;
                break;
        }

        const { videoHeight, videoWidth } = this.props;
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        if (this.guiState.output.showVideo) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-videoWidth, 0);
            ctx.drawImage(this.videoElement!, 0, 0, videoWidth, videoHeight);
            ctx.restore();
        }

        // For each pose (i.e. person) detected in an image, loop through the poses
        // and draw the resulting skeleton and keypoints if over certain confidence
        // scores
        poses.forEach(({ score, keypoints }: any) => {
            if (score >= minPoseConfidence) {
                if (this.guiState.output.showPoints) {
                    drawKeypoints(keypoints, minPartConfidence, ctx);
                }
                if (this.guiState.output.showSkeleton) {
                    drawSkeleton(keypoints, minPartConfidence, ctx);
                }
                if (this.guiState.output.showBoundingBox) {
                    drawBoundingBox(keypoints, ctx);
                }
            }
        });

        // End monitoring code for frames per second
        this.stats!.end();

        requestAnimationFrame(() => this.poseDetectionFrame(ctx, flipHorizontal));
    };
}
