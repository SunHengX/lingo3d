import deserialize from "../api/serializer/deserialize"
import Audio from "../display/Audio"
import CharacterRig from "../display/CharacterRig"
import Model from "../display/Model"
import loadBVH from "../display/utils/loaders/loadBVH"
import { ybotUrlPtr } from "../pointers/assetsPathPointers"
import { configCharacterRigAnimationSystem } from "../systems/configLoadedSystems/configCharacterRigAnimationSystem"

const json = `
[
  { "type": "lingo3d", "version": "2.1.1-alpha.5" },
  { "type": "defaultSkyLight", "uuid": "RtM_U_baYHe63cgaWKNGo" },
  { "type": "setup", "uuid": "jFBkRPhgDGfnuhrkVoZBE" },
  {
    "type": "model",
    "uuid": "7yzh3eTicTRl1irh-_ofB",
    "src": "player2.glb",
    "children": [
      { "type": "find", "uuid": "DYrAq9UEwj-pkk0mZlY4k", "name": "LeftHand" },
      {
        "type": "find",
        "uuid": "T4gxZJQVnmgF5vckjoZwB",
        "name": "LeftShoulder"
      },
      { "type": "find", "uuid": "hYro0qJU0mPuMFV_wIgRF", "name": "LeftArm" },
      {
        "type": "find",
        "uuid": "gqMCdZ20X7hcvlmh3QWgd",
        "name": "LeftForeArm"
      },
      { "type": "find", "uuid": "79AHItgC66WUfVH-Np_az", "name": "Spine2" },
      { "type": "find", "uuid": "zfAXBwnjFBZ2IxW8idkiv", "name": "LeftUpLeg" },
      { "type": "find", "uuid": "jh9HsKlQS33IGI5Mnd9GS", "name": "RightUpLeg" },
      {
        "type": "find",
        "uuid": "SFJq7tLRVGrkD0CUJaJgi",
        "name": "RightShoulder"
      },
      { "type": "find", "uuid": "mg8-ggw06hGSzP__Uyq2g", "name": "LeftLeg" },
      { "type": "find", "uuid": "Pory-0BRY4VFTtzpX_xKA", "name": "RightArm" },
      {
        "type": "find",
        "uuid": "Sj-nQlHGU9o9e9ojVOJua",
        "name": "RightForeArm"
      },
      { "type": "find", "uuid": "KOuAP39CvGqZTxa7eN1u7", "name": "RightHand" },
      { "type": "find", "uuid": "AUe4bah9AVUfviSN-TcE9", "name": "LeftFoot" },
      {
        "type": "find",
        "uuid": "jfRk7vZH0CxqNV_xVpkFF",
        "name": "LeftToeBase"
      },
      { "type": "find", "uuid": "J4G8FHlG8_YHmK3OCDnrV", "name": "RightLeg" },
      { "type": "find", "uuid": "dFe91ZkYFz9D0AOl8tzvt", "name": "RightFoot" },
      {
        "type": "find",
        "uuid": "AwpdjPoV9NsWML4pR5bTN",
        "name": "RightToeBase"
      },
      { "type": "find", "uuid": "jjfoLXVFbaT0c5lVAaaLF", "name": "Neck" },
      { "type": "find", "uuid": "IgQppKI8b8wWdQj7k0Pca", "name": "Spine" },
      { "type": "find", "uuid": "r904ppf5wDlspEsvK8sUB", "name": "Hips" },
      { "type": "find", "uuid": "6v6m1QEI3dz7WjyBXUiF5", "name": "Spine1" },
      { "type": "find", "uuid": "oPP__tgBJKyuWzDR9L6_B", "name": "Head" }
    ]
  },
  {
    "type": "characterRig",
    "uuid": "Flziampan0jndFa2Nr0gp",
    "target": "7yzh3eTicTRl1irh-_ofB",
    "enabled": true,
    "hips": "r904ppf5wDlspEsvK8sUB",
    "spine0": "IgQppKI8b8wWdQj7k0Pca",
    "spine1": "6v6m1QEI3dz7WjyBXUiF5",
    "spine2": "79AHItgC66WUfVH-Np_az",
    "neck": "jjfoLXVFbaT0c5lVAaaLF",
    "head": "oPP__tgBJKyuWzDR9L6_B",
    "leftShoulder": "T4gxZJQVnmgF5vckjoZwB",
    "leftArm": "hYro0qJU0mPuMFV_wIgRF",
    "leftForeArm": "gqMCdZ20X7hcvlmh3QWgd",
    "leftHand": "DYrAq9UEwj-pkk0mZlY4k",
    "rightShoulder": "SFJq7tLRVGrkD0CUJaJgi",
    "rightArm": "Pory-0BRY4VFTtzpX_xKA",
    "rightForeArm": "Sj-nQlHGU9o9e9ojVOJua",
    "rightHand": "KOuAP39CvGqZTxa7eN1u7",
    "leftThigh": "zfAXBwnjFBZ2IxW8idkiv",
    "leftLeg": "mg8-ggw06hGSzP__Uyq2g",
    "leftFoot": "AUe4bah9AVUfviSN-TcE9",
    "leftForeFoot": "jfRk7vZH0CxqNV_xVpkFF",
    "rightThigh": "jh9HsKlQS33IGI5Mnd9GS",
    "rightLeg": "J4G8FHlG8_YHmK3OCDnrV",
    "rightFoot": "dFe91ZkYFz9D0AOl8tzvt",
    "rightForeFoot": "AwpdjPoV9NsWML4pR5bTN",
    "children": [
      {
        "type": "characterRigJoint",
        "uuid": "Flziampan0jndFa2Nr0gp.hips",
        "name": "hips",
        "rotationX": -3.44,
        "rotationY": 0,
        "rotationZ": 0,
        "children": [
          {
            "type": "characterRigJoint",
            "uuid": "Flziampan0jndFa2Nr0gp.leftThigh",
            "name": "leftThigh",
            "rotationX": 3.02,
            "rotationY": 0.1,
            "rotationZ": 3.85,
            "children": [
              {
                "type": "characterRigJoint",
                "uuid": "Flziampan0jndFa2Nr0gp.leftLeg",
                "name": "leftLeg",
                "rotationX": 4.32,
                "rotationY": -0.15,
                "rotationZ": -0.1,
                "children": [
                  {
                    "type": "characterRigJoint",
                    "uuid": "Flziampan0jndFa2Nr0gp.leftFoot",
                    "name": "leftFoot",
                    "rotationX": -59.33,
                    "rotationY": 3.1,
                    "rotationZ": -2.13,
                    "children": [
                      {
                        "type": "characterRigJoint",
                        "uuid": "Flziampan0jndFa2Nr0gp.leftForeFoot",
                        "name": "leftForeFoot",
                        "rotationX": -38.44,
                        "rotationY": -3.32,
                        "rotationZ": 3.28
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "characterRigJoint",
            "uuid": "Flziampan0jndFa2Nr0gp.rightThigh",
            "name": "rightThigh",
            "rotationX": 3.02,
            "rotationY": -0.1,
            "rotationZ": -3.85,
            "children": [
              {
                "type": "characterRigJoint",
                "uuid": "Flziampan0jndFa2Nr0gp.rightLeg",
                "name": "rightLeg",
                "rotationX": 4.32,
                "rotationY": 0.15,
                "rotationZ": 0.1,
                "children": [
                  {
                    "type": "characterRigJoint",
                    "uuid": "Flziampan0jndFa2Nr0gp.rightFoot",
                    "name": "rightFoot",
                    "rotationX": -59.33,
                    "rotationY": -3.1,
                    "rotationZ": 2.13,
                    "children": [
                      {
                        "type": "characterRigJoint",
                        "uuid": "Flziampan0jndFa2Nr0gp.rightForeFoot",
                        "name": "rightForeFoot",
                        "rotationX": -38.44,
                        "rotationY": 3.32,
                        "rotationZ": -3.28
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "characterRigJoint",
            "uuid": "Flziampan0jndFa2Nr0gp.spine0",
            "name": "spine0",
            "rotationX": -1.58,
            "rotationY": 0,
            "rotationZ": 0,
            "children": [
              {
                "type": "characterRigJoint",
                "uuid": "Flziampan0jndFa2Nr0gp.spine1",
                "name": "spine1",
                "rotationX": -4.17,
                "rotationY": 0,
                "rotationZ": 0,
                "children": [
                  {
                    "type": "characterRigJoint",
                    "uuid": "Flziampan0jndFa2Nr0gp.spine2",
                    "name": "spine2",
                    "rotationX": 7.29,
                    "rotationY": 0,
                    "rotationZ": 0,
                    "children": [
                      {
                        "type": "characterRigJoint",
                        "uuid": "Flziampan0jndFa2Nr0gp.leftShoulder",
                        "name": "leftShoulder",
                        "rotationX": 9.78,
                        "rotationY": 8.08,
                        "rotationZ": 79.07,
                        "children": [
                          {
                            "type": "characterRigJoint",
                            "uuid": "Flziampan0jndFa2Nr0gp.leftArm",
                            "name": "leftArm",
                            "rotationX": -8.57,
                            "rotationY": 5.86,
                            "rotationZ": -43.98,
                            "children": [
                              {
                                "type": "characterRigJoint",
                                "uuid": "Flziampan0jndFa2Nr0gp.leftForeArm",
                                "name": "leftForeArm",
                                "rotationX": -27.47,
                                "rotationY": 8.96,
                                "rotationZ": -0.53,
                                "children": [
                                  {
                                    "type": "characterRigJoint",
                                    "uuid": "Flziampan0jndFa2Nr0gp.leftHand",
                                    "name": "leftHand",
                                    "rotationX": -9.65,
                                    "rotationY": 6.14,
                                    "rotationZ": -9.3
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "characterRigJoint",
                        "uuid": "Flziampan0jndFa2Nr0gp.rightShoulder",
                        "name": "rightShoulder",
                        "rotationX": 9.78,
                        "rotationY": -8.08,
                        "rotationZ": -79.08,
                        "children": [
                          {
                            "type": "characterRigJoint",
                            "uuid": "Flziampan0jndFa2Nr0gp.rightArm",
                            "name": "rightArm",
                            "rotationX": -8.57,
                            "rotationY": -5.87,
                            "rotationZ": 43.98,
                            "children": [
                              {
                                "type": "characterRigJoint",
                                "uuid": "Flziampan0jndFa2Nr0gp.rightForeArm",
                                "name": "rightForeArm",
                                "rotationX": -27.47,
                                "rotationY": -8.96,
                                "rotationZ": 0.53,
                                "children": [
                                  {
                                    "type": "characterRigJoint",
                                    "uuid": "Flziampan0jndFa2Nr0gp.rightHand",
                                    "name": "rightHand",
                                    "rotationX": -9.65,
                                    "rotationY": -6.14,
                                    "rotationZ": 9.3
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "characterRigJoint",
                        "uuid": "Flziampan0jndFa2Nr0gp.neck",
                        "name": "neck",
                        "rotationX": 16.05,
                        "rotationY": 0,
                        "rotationZ": 0,
                        "children": [
                          {
                            "type": "characterRigJoint",
                            "uuid": "Flziampan0jndFa2Nr0gp.head",
                            "name": "head",
                            "rotationX": -14.16,
                            "rotationY": 0,
                            "rotationZ": 0
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]  
`
// const characterRig = deserialize(JSON.parse(json) as any).find(
//     (child) => child instanceof CharacterRig
// ) as CharacterRig

const dummy = new Model()
dummy.src = ybotUrlPtr[0]
dummy.animations = {
    running: "Running.fbx"
}
dummy.animation = "running"
dummy.x = 50
// dummy.remove()

// configCharacterRigAnimationSystem.add(characterRig, { target: dummy })

const rig = new CharacterRig()

const model = new Model()
model.src = "player2.glb"
model.scale = 1.7
model.y = 85

loadBVH("dance.bvh")